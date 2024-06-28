using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Email;
using Event_Planning_System.Enitities;
using Event_Planning_System.Event.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using Event_Planning_System.Image;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
		private readonly IRepository<Enitities.notification, int> _notificationRepository;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IMapper _mapper;
		private readonly IEmailService _emailService;
		private readonly string _imageFolderPath;
        private readonly ILogger<EventAppService> _logger;

        private readonly IRepository<Interest, int> _interestRepository;



		public EventAppService(IRepository<Enitities.Event, int> repository, IRepository<Enitities.Guest, int> guestRepository, IRepository<Interest, int> interestRepository,
            IRepository<Enitities.BudgetExpense, int> budgetExpenseRepository,
			IRepository<Enitities.ToDoCheckList, int> toDoCheckListRepository,IRepository<Enitities.notification, int> notificationRepository, IMapper mapper, IEmailService emailService, ICloudinaryService cloudinaryService, ILogger<EventAppService> logger) : base(repository)
		{
			_repository = repository;
			_cloudinaryService = cloudinaryService;
			_interestRepository = interestRepository;
			_guestRepository = guestRepository;
			_budgetExpenseRepository = budgetExpenseRepository;
			_toDoCheckListRepository = toDoCheckListRepository;
			_notificationRepository = notificationRepository;
			_logger=logger;
			_mapper = mapper;
			_emailService = emailService;
			_imageFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
			if (!Directory.Exists(_imageFolderPath))
			{
				Directory.CreateDirectory(_imageFolderPath);
			}
		}

		public async Task<IEnumerable<EventDto>> GetEventsByIds(IEnumerable<int> eventIds)
		{
			if (eventIds == null || !eventIds.Any())
			{
				return new List<EventDto>();
			}

			var events = await _repository.GetAll()
										  .Where(e => eventIds.Contains(e.Id))
										  .ToListAsync();

			return _mapper.Map<List<EventDto>>(events);
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
			var upcomingEvents = await _repository.GetAllListAsync(e => e.UserId == userId && e.StartDate <= today.AddDays(5) && e.StartDate > today);

			return _mapper.Map<List<EventDto>>(upcomingEvents);
		}
		public async Task<int> GetReminderCount()
		{
			var userId = AbpSession.UserId.Value;
			var notifications = await GetReminderOfUpcomming();
			var NewNotification = notifications.Where(n => n.isRead == false).Count();
			return NewNotification;
		}
		public async Task UpdateReminderStatus(UpdateEventStatusDto input)
		{

			var reminderEntity = await _repository.GetAsync(input.Id);
			reminderEntity.isRead = true;
			await _repository.UpdateAsync(reminderEntity);
			await CurrentUnitOfWork.SaveChangesAsync();


		}

		//public async Task UpdateReminderStatus([FromBody] UpdateEventStatusDto input)
		//{
		//          var old =await  GetReminderOfUpcomming();
		//          var res=  old.FirstOrDefault(r=>r.Id==input.Id);
		//	if (res == null)
		//	{
		//		throw new Abp.UI.UserFriendlyException("Reminder not found");
		//	}
		//          res.isRead = true;
		//          await CurrentUnitOfWork.SaveChangesAsync();
		//}

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
                try
                {
                    using (var stream = input.EventImgFile.OpenReadStream())
                    {
                        var uploadResult = await _cloudinaryService.UploadImageAsync(stream, input.EventImgFile.FileName);
                        if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                        {
                            input.EventImg = uploadResult.Url.ToString();
                        }
                        else
                        {
                            _logger.LogError("Cloudinary upload failed: {0}", uploadResult.Error?.Message);
                            throw new Exception($"Cloudinary upload failed: {uploadResult.Error?.Message}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error uploading image to Cloudinary");
                    throw new Exception("There was an error uploading the image to Cloudinary.", ex);
                }
            }

            var eventEntity = _mapper.Map<Enitities.Event>(input);
            await _repository.InsertAsync(eventEntity);
            await CurrentUnitOfWork.SaveChangesAsync();
            return _mapper.Map<EventDto>(eventEntity);
        }




        public async Task<List<EventDto>> GetPublicEventsByInterest()
		{
			var publicEvents = new HashSet<EventDto>();
			var orderedPublicEvents = new List<EventDto>();
			var userId = AbpSession.UserId;

			if (userId.HasValue && userId > 0)
			{
				var interests = await _interestRepository.GetAll()
					.Include(i => i.Users)
					.Where(i => i.Users.Any(u => u.Id == userId))
					.ToListAsync();
				if (interests.Count > 0)
				{
                    foreach (var interest in interests)
                    {
                        var interestEvents = await _repository.GetAll()
                            .Where(e => e.Category == interest.Type && e.IsPublic && e.UserId != userId && e.StartDate >= DateTime.Now)
                            .ToListAsync();

                        var mappedInterestEvents = _mapper.Map<List<EventDto>>(interestEvents);

                        foreach (var eventDto in mappedInterestEvents)
                        {
                            if (publicEvents.Add(eventDto))
                            {
                                orderedPublicEvents.Add(eventDto);
                            }
                        }
                    }
				}
				else
				{
                    var publicEventsFromDb = await _repository.GetAll()
                    .Where(e => e.IsPublic && e.UserId != userId && e.StartDate >= DateTime.Now)
                    .ToListAsync();

                    var mappedPublicEvents = _mapper.Map<List<EventDto>>(publicEventsFromDb);

                    foreach (var eventDto in mappedPublicEvents)
                    {
                        if (publicEvents.Add(eventDto))
                        {
                            orderedPublicEvents.Add(eventDto);
                        }
                    }
                }
				
			}
			else
			{

				var publicEventsFromDb = await _repository.GetAll()
					.Where(e => e.IsPublic && e.StartDate >= DateTime.Now)
					.ToListAsync();

				var mappedPublicEvents = _mapper.Map<List<EventDto>>(publicEventsFromDb);

				foreach (var eventDto in mappedPublicEvents)
				{
					if (publicEvents.Add(eventDto))
					{
						orderedPublicEvents.Add(eventDto);
					}
				}
			}

			// Return the ordered list of events with interest-based events first
			return orderedPublicEvents;
		}

        public async Task DeleteEventWithDetailsAsync(int eventId)
        {
            try
            {
                var eventEntity = await _repository.FirstOrDefaultAsync(eventId);
                if (eventEntity == null)
                {
                    throw new Abp.UI.UserFriendlyException("Event not found");
                }

                var today = DateTime.Today;
                if (eventEntity.StartDate > today && eventEntity.EndDate > today)
                {
                    var guests = await _guestRepository.GetAllListAsync(g => g.Events.Any(e => e.Id == eventId) && g.InvitationState != "Pending");
                    foreach (var guest in guests)
                    {
                        var htmlBody = EmailCanceledTemple.GenerateEventCancellationEmail(eventEntity.Name, eventEntity.StartDate, guest.Name);
                        await _emailService.SendEmailAsync(guest.Email, "Event Cancellation", htmlBody);
                    }
                }
                var budgetExpenses = await _budgetExpenseRepository.GetAllListAsync(be => be.EventId == eventId);
                foreach (var budgetExpense in budgetExpenses)
                {
                    await _budgetExpenseRepository.DeleteAsync(budgetExpense);
                }
                var notifications = await _notificationRepository.GetAllListAsync(ne=>ne.EventId==eventId);
                foreach (var notification in notifications)
                {
                    await _notificationRepository.DeleteAsync(notification);
                }
                var toDoCheckLists = await _toDoCheckListRepository.GetAllListAsync(tc => tc.EventId == eventId);
                foreach (var toDoCheckList in toDoCheckLists)
                {
                    await _toDoCheckListRepository.DeleteAsync(toDoCheckList);
                }
                var eventGuests = await _guestRepository.GetAllListAsync(g => g.Events.Any(e => e.Id == eventId));
                foreach (var guest in eventGuests)
                {
                    guest.Events.Remove(eventEntity);
                    await _guestRepository.UpdateAsync(guest);
                }
                await _guestRepository.DeleteAsync(g => g.Events.Any(e => e.Id == eventId));

                await _repository.DeleteAsync(eventEntity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting event with ID {EventId}", eventId);
                throw new Abp.UI.UserFriendlyException("An internal error occurred while trying to delete the event.");
            }
        }


        public async Task<EventDto> GetEventByIdAsync(int id)
        {
            var eventEntity = await _repository.GetAll()
                                               .FirstOrDefaultAsync(e => e.Id == id);
            if (eventEntity == null)
            {
                throw new EntryPointNotFoundException("Event not found");
            }

            var eventDto = _mapper.Map<EventDto>(eventEntity);
            return eventDto;
        }

    }

}





