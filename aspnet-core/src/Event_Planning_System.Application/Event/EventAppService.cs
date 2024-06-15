using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Email;
using Event_Planning_System.Enitities;
using Event_Planning_System.Event.Dto;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

using System.Linq;
using System.Threading.Tasks;

namespace Event_Planning_System.Event
{
    public class EventAppService : AsyncCrudAppService<Enitities.Event, EventDto, int, PagedAndSortedResultRequestDto, CreateEventDto, EventDto>, IEventAppService
    {
        private readonly IRepository<Enitities.Event, int> _repository;
        private readonly IRepository<Enitities.Guest, int> _guestRepository;
        private readonly IRepository<Enitities.BudgetExpense, int> _budgetExpenseRepository;
        private readonly IRepository<Enitities.ToDoCheckList, int> _toDoCheckListRepository;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly string _imageFolderPath;

        private readonly IRepository<Interest, int> _interestRepository;


        public EventAppService(IRepository<Enitities.Event, int> repository, IMapper mapper, IRepository<Interest, int> interestRepository) : base(repository)
        public EventAppService(IRepository<Enitities.Event, int> repository, IRepository<Enitities.Guest, int> guestRepository,
            IRepository<Enitities.BudgetExpense, int> budgetExpenseRepository,
            IRepository<Enitities.ToDoCheckList, int> toDoCheckListRepository, IMapper mapper, IEmailService emailService) : base(repository)
        {
            _repository = repository;
            _interestRepository=interestRepository;
            _guestRepository = guestRepository;
            _budgetExpenseRepository = budgetExpenseRepository;
            _toDoCheckListRepository = toDoCheckListRepository;
            _mapper = mapper;
            _emailService = emailService;
            _imageFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
            if (!Directory.Exists(_imageFolderPath))
            {
                Directory.CreateDirectory(_imageFolderPath);
            }
        }

        public async Task<List<EventDto>> GetUserEventsAsync(long userId)
        {
            var events = await _repository.GetAllListAsync(e => e.UserId == userId);
            return _mapper.Map<List<EventDto>>(events);
        }

        public async Task<List<EventDto>> GetUpcomingEventsForCurrentUserAsync(long userId)
        {
            var today = DateTime.Today;
            var upcomingEvents = await _repository.GetAllListAsync(e => e.UserId == userId && e.StartDate >= today);
            return _mapper.Map<List<EventDto>>(upcomingEvents);
        }
		
        
        public async Task<List<EventDto>> GetReminderOfUpcomming()
		{
            var userId = AbpSession.UserId.Value;
			var today = DateTime.Today;
			var upcomingEvents = await _repository.GetAllListAsync(e => e.UserId == userId && e.StartDate <= today.AddDays(5) && e.StartDate>today) ;

			return _mapper.Map<List<EventDto>>(upcomingEvents);
		}
		public async Task<List<EventDto>> GetHistoryEventAsync(long userId)
        {
            var today = DateTime.Today;
            var events = await _repository.GetAllListAsync(e => e.UserId == userId && e.EndDate < today);
            return _mapper.Map<List<EventDto>>(events);
        }

        public override async Task<EventDto> CreateAsync([FromForm] CreateEventDto input)
        {
            if (input.EventImgFile != null && input.EventImgFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(input.EventImgFile.FileName);
                var filePath = Path.Combine(_imageFolderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await input.EventImgFile.CopyToAsync(stream);
                }

                input.EventImg = $"/images/{fileName}";
            }

            var eventEntity = _mapper.Map<Enitities.Event>(input);
            await _repository.InsertAsync(eventEntity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return _mapper.Map<EventDto>(eventEntity);
        }


        public async Task<List<EventDto>> GetPublicEventsByInterest()
        {
            var userId = AbpSession.UserId.Value;
            List<EventDto> publicEvents = new List<EventDto>();
            if (userId > 0)
            {
                var interests = await _interestRepository.GetAll()
                    .Include(i => i.Users)
                    .Where(i => i.Users.Any(u => u.Id == userId))
                    .ToListAsync();
                foreach (var interest in interests)
                {
                    var events = await _repository.GetAll()
                        .Where(e => e.Category == interest.Type && e.IsPublic)
                        .ToListAsync();

                    var mappedEvents = _mapper.Map<List<EventDto>>(events);
                    publicEvents.AddRange(mappedEvents);
                }
            }
            else
            {
                var events = await _repository.GetAll()
                        .Where(e => e.IsPublic)
                        .ToListAsync();
                var mappedEvents = _mapper.Map<List<EventDto>>(events);
                publicEvents.AddRange(mappedEvents);
            }

            return publicEvents;
        }
            
        }
   }

        public async Task DeleteEventWithDetailsAsync(int eventId)
        {
            var eventEntity = await _repository.GetAsync(eventId);
            if (eventEntity == null)
            {
                throw new Abp.UI.UserFriendlyException("Event not found");
            }

            var today = DateTime.Today;
            if (eventEntity.StartDate > today && eventEntity.EndDate > today)
            {
                var guests = await _guestRepository.GetAllListAsync(g => g.Events.Any(e => e.Id == eventId));
                foreach (var guest in guests)
                {
                    var htmlBody = EmailCanceledTemple.GenerateEventCancellationEmail(eventEntity.Name, eventEntity.StartDate, guest.Name);
                    await _emailService.SendEmailAsync(guest.Email, "Event Cancellation", htmlBody);
                }
            }
            await _budgetExpenseRepository.DeleteAsync(be => be.EventId == eventId);
            await _toDoCheckListRepository.DeleteAsync(tc => tc.EventId == eventId);
            await _guestRepository.DeleteAsync(g => g.Events.Any(e => e.Id == eventId));
            await _repository.DeleteAsync(eventEntity);
        }


    }
}
