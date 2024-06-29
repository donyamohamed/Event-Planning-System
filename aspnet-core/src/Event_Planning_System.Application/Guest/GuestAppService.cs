using Abp.Application.Services;
using Abp.Domain.Entities;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using Event_Planning_System.Guest.Dto;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;

using System;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.IO;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Abp.Runtime.Validation;

namespace Event_Planning_System.Guest
{
    public class GuestAppService : AsyncCrudAppService<Enitities.Guest, GuestDto, int>, IGuestAppService
    {

        private readonly IRepository<Enitities.Guest, int> _repository;
        private readonly IRepository<Enitities.Event, int> _repositoryEvent;
        private readonly IMapper _mapper;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<Enitities.Event, int> repositoryEvent;


        public GuestAppService(IRepository<Enitities.Guest, int> repository, IRepository<User, long> userRepository, IRepository<Enitities.Event, int> repositoryEvent, IMapper mapper) : base(repository)

        {
            _repository = repository;
            _repositoryEvent= repositoryEvent;
            _repositoryEvent= repositoryEvent;
            _mapper = mapper;
            _userRepository = userRepository;
            _userRepository = userRepository;
        }

        public async Task<List<GuestDto>> GetEventGuestsAsync(int eventId)
        {
            var guests = await _repository.GetAllListAsync(g => g.Events.Any(e => e.Id == eventId));
            return _mapper.Map<List<GuestDto>>(guests);
        }

        public async Task Add(Enitities.Guest guest, int eventId)
        {
            await ValidateGuestEmail(guest.Email,eventId);
            var eventUser = await _repositoryEvent.FirstOrDefaultAsync(eventId);
            if (eventUser == null)
            {
                throw new EntityNotFoundException(typeof(Enitities.Event), eventId);
            }
            guest.InvitationState = "Pending";
            eventUser.Guests.Add(guest);
            await _repositoryEvent.UpdateAsync(eventUser);
        }




        public async Task<IActionResult> AddGuestsThroughExcelFile([FromForm] IFormFile file, int eventId)
        {

            try
            {
                
                var userId = AbpSession.UserId.Value;
                var user = await _userRepository.GetAllIncluding(u => u.Guests).FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    throw new Exception("User not found.");
                }

                var eventUser = await _repositoryEvent.GetAllIncluding(e => e.Guests).FirstOrDefaultAsync(e => e.Id == eventId && e.UserId == userId);

                if (eventUser == null)
                {
                    throw new Exception("Event not found or does not belong to the user.");
                }

                System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

                if (file == null || file.Length == 0)
                    return new BadRequestObjectResult("No file uploaded");

                var guestList = new List<GuestDto>();

                using (var stream = file.OpenReadStream())
                {
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {
                        reader.Read(); 

                        while (reader.Read())
                        {
                            var guest = new GuestDto
                            {
                                Name = reader.GetValue(0)?.ToString(),
                                Phone = reader.GetValue(1)?.ToString(),
                                Email = reader.GetValue(2)?.ToString(),
                                InvitationState = "Pending",
                                UserId = userId,
                                EventId = eventId
                            };
                            
                            guestList.Add(guest);
                        }
                        
                    }
                }

                var MaxCountForGuests = _repositoryEvent.Get(eventId).MaxCount;
                var CurrentGuestsInEvent= eventUser.Guests.Count;
                var availablePlaces= MaxCountForGuests - CurrentGuestsInEvent;
                var GuestsInsertedByExcel = guestList.Count;



                if (availablePlaces < GuestsInsertedByExcel)
                {
                    return new BadRequestObjectResult($"You can only insert {availablePlaces} guests , but you are trying to insert {GuestsInsertedByExcel}.");

                }

                var guestsToAdd = guestList.Where(g => !eventUser.Guests.Any(eg => eg.Email == g.Email))
                               .Take(availablePlaces)
                               .ToList();

                foreach (var guestDto in guestsToAdd)
                {
                    var entity = _mapper.Map<Enitities.Guest>(guestDto);
                    eventUser.Guests.Add(entity);
                    user.Guests.Add(entity);
                }

                await _repositoryEvent.UpdateAsync(eventUser);
                await _userRepository.UpdateAsync(user);

                return new OkObjectResult($"Successfully inserted {guestsToAdd.Count} guests. still {availablePlaces - guestsToAdd.Count} you can insert");
            }
            catch (Exception ex)
            {
                return new ObjectResult($"There is an error ");
            }
        }


        public async Task UpdateInvitationState(int guestId, string newState)
        {
            var guest = await _repository.FirstOrDefaultAsync(guestId);
            if (guest == null)
            {
                throw new EntityNotFoundException(typeof(Enitities.Guest), guestId);
            }

            guest.InvitationState = newState;
            await _repository.UpdateAsync(guest);
        }

        public async Task<GuestDto> GetGuestByEmailAsync(string email)
        {
            var guest = await _repository.FirstOrDefaultAsync(g => g.Email == email);
            if (guest == null)
            {
                throw new EntityNotFoundException(typeof(Enitities.Guest), email);
            }
            return _mapper.Map<GuestDto>(guest);
        }
        private async Task ValidateGuestEmail(string email, int? eventId = null)
        {
            var existingGuest = await _repository.FirstOrDefaultAsync(g => g.Email == email && g.Events.Any(e => e.Id==eventId));
            if (existingGuest != null)
            {
                throw new AbpValidationException("Email address already exists.");
            }
        }
    }
}
