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
using Abp.Collections.Extensions;
using System.Text.RegularExpressions;
using Castle.Core.Internal;
using Event_Planning_System.Email;

namespace Event_Planning_System.Guest
{
    public class GuestAppService : AsyncCrudAppService<Enitities.Guest, GuestDto, int>, IGuestAppService
    {

        private readonly IRepository<Enitities.Guest, int> _repository;
        private readonly IRepository<Enitities.Event, int> _repositoryEvent;
        private readonly IMapper _mapper;
        private readonly IRepository<User, long> _userRepository;
        private readonly IRepository<Enitities.Event, int> repositoryEvent;
        private readonly EmailService _emailService;


        public GuestAppService(IRepository<Enitities.Guest, int> repository, IRepository<User, long> userRepository, IRepository<Enitities.Event, int> repositoryEvent, IMapper mapper, EmailService emailService) : base(repository)

        {
            _repository = repository;
            _repositoryEvent = repositoryEvent;
            _repositoryEvent = repositoryEvent;
            _mapper = mapper;
            _userRepository = userRepository;
            _userRepository = userRepository;
            _emailService = emailService;
        }

        public async Task<List<GuestDto>> GetEventGuestsAsync(int eventId)
        {
            var guests = await _repository.GetAllListAsync(g => g.Events.Any(e => e.Id == eventId));
            return _mapper.Map<List<GuestDto>>(guests);
        }

        public async Task Add(Enitities.Guest guest, int eventId)
        {
            await ValidateGuestEmail(guest.Email, eventId);
            var eventUser = await _repositoryEvent.FirstOrDefaultAsync(eventId);
            if (eventUser == null)
            {
                throw new EntityNotFoundException(typeof(Enitities.Event), eventId);
            }
            guest.InvitationState = "Pending";
            eventUser.Guests.Add(guest);
            await _repositoryEvent.UpdateAsync(eventUser);
        }




        //public async Task<IActionResult> AddGuestsThroughExcelFile([FromForm] IFormFile file, int eventId)
        //{

        //    try
        //    {

        //        var userId = AbpSession.UserId.Value;
        //        var user = await _userRepository.GetAllIncluding(u => u.Guests).FirstOrDefaultAsync(u => u.Id == userId);
        //        var gests = await _repository.GetAllListAsync();

        //        if (user == null)
        //        {
        //            throw new Exception("User is not found.");
        //        }

        //        var eventUser = await _repositoryEvent.GetAllIncluding(e => e.Guests).FirstOrDefaultAsync(e => e.Id == eventId && e.UserId == userId);

        //        if (eventUser == null)
        //        {
        //            throw new Exception("Event does not found or does not belong to the user.");
        //        }

        //        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        //        if (file == null || file.Length == 0)
        //            return new BadRequestObjectResult("No file uploaded");


        //        var namePattern = @"^[a-zA-Z\s]+$";
        //        var phonePattern = @"^\+?[1-9]\d{1,14}$";
        //        var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

        //        var guestList = new List<GuestDto>();
        //        var validationRow = new List<string>();
        //        int rowNumber = 2;

        //        using (var stream = file.OpenReadStream())
        //        {
        //            using (var reader = ExcelReaderFactory.CreateReader(stream))
        //            {
        //                reader.Read(); 

        //                while (reader.Read())
        //                {
        //                    var name = reader.GetValue(0)?.ToString();
        //                    var phone = reader.GetValue(1)?.ToString();
        //                    var email = reader.GetValue(2)?.ToString();

        //                    if (string.IsNullOrWhiteSpace(name) || !Regex.IsMatch(name, namePattern)
        //                        || string.IsNullOrWhiteSpace(phone) || !Regex.IsMatch(phone, phonePattern)
        //                        || string.IsNullOrWhiteSpace(email) || !Regex.IsMatch(email, emailPattern))
        //                    {
        //                        validationRow.Add($"Row {rowNumber} : Invalid data - Name: {name}, Phone: {phone}, Email: {email} ");

        //                    }
        //                    else
        //                    {

        //                        var guest = new GuestDto
        //                        {
        //                            //Name = reader.GetValue(0)?.ToString(),
        //                            //Phone = reader.GetValue(1)?.ToString(),
        //                            //Email = reader.GetValue(2)?.ToString(),
        //                            Name = name,
        //                            Phone = phone,
        //                            Email = email,
        //                            InvitationState = "Pending",
        //                            UserId = userId,
        //                            EventId = eventId
        //                        };
        //                        guestList.Add(guest);
        //                    }
        //                        rowNumber++;
        //                }
        //                if (validationRow.Count > 0)
        //                {
        //                    return new BadRequestObjectResult($"The file contains invalid data: {string.Join("; ", validationRow)}");
        //                }

        //                if (guestList.Count == 0)
        //                {
        //                    return new BadRequestObjectResult($"The file is empty .");

        //                }
        //            }
        //        }

        //        var MaxCountForGuests = _repositoryEvent.Get(eventId).MaxCount;
        //        var CurrentGuestsInEvent= eventUser.Guests.Count;
        //        var availablePlaces= MaxCountForGuests - CurrentGuestsInEvent;
        //        var GuestsInsertedByExcel = guestList.Count;



        //        if (availablePlaces < GuestsInsertedByExcel)
        //        {
        //            return new BadRequestObjectResult($"You can only insert {availablePlaces} guests , but you are trying to insert {GuestsInsertedByExcel}.");

        //        }

        //        var guestsToAdd = guestList.Where(g => !eventUser.Guests.Any(eg => eg.Email == g.Email))
        //                       .Take(availablePlaces)
        //                       .ToList();

        //        foreach (var guestDto in guestsToAdd)
        //        {
        //            var entity = _mapper.Map<Enitities.Guest>(guestDto);
        //            var guest = gests.Where(g => g.Email== entity.Email).FirstOrDefault();
        //            var finalguest = guest ?? entity;

        //            eventUser.Guests.Add(finalguest);
        //            user.Guests.Add(finalguest);
        //        }

        //        await _repositoryEvent.UpdateAsync(eventUser);
        //        await _userRepository.UpdateAsync(user);

        //        return new OkObjectResult($"Successfully inserted {guestsToAdd.Count} guests. still {availablePlaces - guestsToAdd.Count} you can insert");

        //    }
        //    catch (Exception ex)
        //    {
        //        return new ObjectResult($"There is an error ");
        //    }
        //}




        public async Task<IActionResult> AddGuestsThroughExcelFile([FromForm] IFormFile file, int eventId)
        {
            try
            {
                var userId = AbpSession.UserId.Value;
                var user = await _userRepository.GetAllIncluding(u => u.Guests).FirstOrDefaultAsync(u => u.Id == userId);
                var allGuests = await _repository.GetAllListAsync();

                if (user == null)
                {
                    throw new Exception("User is not found.");
                }

                var eventUser = await _repositoryEvent.GetAllIncluding(e => e.Guests).FirstOrDefaultAsync(e => e.Id == eventId && e.UserId == userId);

                if (eventUser == null)
                {
                    throw new Exception("Event does not found or does not belong to the user.");
                }

                System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

                if (file == null || file.Length == 0)
                    return new BadRequestObjectResult("No file uploaded");

                var namePattern = @"^[a-zA-Z\s]+$";
                var phonePattern = @"^\+?[1-9]\d{1,14}$";
                var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

                var guestList = new List<GuestDto>();
                var validationRow = new List<string>();
                int rowNumber = 2;

                using (var stream = file.OpenReadStream())
                {
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {
                        reader.Read();

                        while (reader.Read())
                        {
                            var name = reader.GetValue(0)?.ToString();
                            var phone = reader.GetValue(1)?.ToString();
                            var email = reader.GetValue(2)?.ToString();

                            if (string.IsNullOrWhiteSpace(name) || !Regex.IsMatch(name, namePattern)
                                || string.IsNullOrWhiteSpace(phone) || !Regex.IsMatch(phone, phonePattern)
                                || string.IsNullOrWhiteSpace(email) || !Regex.IsMatch(email, emailPattern))
                            {
                                validationRow.Add($"Row {rowNumber} : Invalid data - Name: {name}, Phone: {phone}, Email: {email} ");
                            }
                            else
                            {
                                var guest = new GuestDto
                                {
                                    Name = name,
                                    Phone = phone,
                                    Email = email,
                                    InvitationState = "Pending",
                                    UserId = userId,
                                    EventId = eventId
                                };
                                guestList.Add(guest);
                            }
                            rowNumber++;
                        }
                        if (validationRow.Count > 0)
                        {
                            return new BadRequestObjectResult($"The file contains invalid data: {string.Join("; ", validationRow)}");
                        }

                        if (guestList.Count == 0)
                        {
                            return new BadRequestObjectResult("The file is empty.");
                        }
                    }
                }

                var maxCountForGuests = _repositoryEvent.Get(eventId).MaxCount;
                var currentGuestsInEvent = eventUser.Guests.Count;
                var availablePlaces = maxCountForGuests - currentGuestsInEvent;
                var guestsInsertedByExcel = guestList.Count;

                if (availablePlaces < guestsInsertedByExcel)
                {
                    return new BadRequestObjectResult($"You can only insert {availablePlaces} guests, but you are trying to insert {guestsInsertedByExcel}.");
                }

                var guestsToAdd = guestList.Where(g => !eventUser.Guests.Any(eg => eg.Email == g.Email))
                               .Take(availablePlaces)
                               .ToList();

                var existingGuests = guestList.Where(g => eventUser.Guests.Any(eg => eg.Email == g.Email))
                                              .ToList();

                foreach (var guestDto in guestsToAdd)
                {
                    var entity = _mapper.Map<Enitities.Guest>(guestDto);
                    var existingGuest = allGuests.FirstOrDefault(g => g.Email == entity.Email);
                    var finalGuest = existingGuest ?? entity;

                    eventUser.Guests.Add(finalGuest);
                    user.Guests.Add(finalGuest);
                }

                await _repositoryEvent.UpdateAsync(eventUser);
                await _userRepository.UpdateAsync(user);

                var resultMessage = $"Successfully inserted {guestsToAdd.Count} guests.";

                if (existingGuests.Count > 0)
                {
                    resultMessage += $" The following guests were already in the event: {string.Join(", ", existingGuests.Select(g => g.Email))}.";
                }

                resultMessage += $" You can still insert {availablePlaces - guestsToAdd.Count} guests.";

                return new OkObjectResult(resultMessage);
            }
            catch (Exception ex)
            {
                return new ObjectResult($"There is an error: {ex.Message}");
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
            var existingGuest = await _repository.FirstOrDefaultAsync(g => g.Email == email && g.Events.Any(e => e.Id == eventId));
            if (existingGuest != null)
            {
                throw new AbpValidationException("Email address already exists.");
            }
        }
        public async Task DeleteAllGuests(int eventId, int?[] ids)
        {
            var guests = await GetEventGuestsAsync(eventId);

            if (guests != null)
            {
                if (ids == null || ids.Length == 0)
                {
                    foreach (var guest in guests)
                    {
                        await _repository.DeleteAsync(guest.Id);
                    }
                }
                else
                {
                    // Delete guests with specific IDs
                    foreach (var id in ids)
                    {
                        var guestToDelete = guests.FirstOrDefault(g => g.Id == id);
                        if (guestToDelete != null)
                        {
                            await _repository.DeleteAsync(guestToDelete.Id);
                        }
                    }
                }
            }
        }
        public async Task<int> SendToAllGuests(int eventId, int?[] ids)
        {
            var guests = await GetEventGuestsAsync(eventId);
            int invitationCount = 0;

            if (guests.Any())
            {
                var guestsToSend = ids == null || ids.Length == 0 ? guests : guests.Where(g => ids.Contains(g.Id));

                foreach (var guest in guestsToSend)
                {
                    if (guest.InvitationState == "Sent")
                    {
                        continue;
                    }
                   // var htmlBody = EmailTemplate.GetInvitationEmail(emailRequest.E//ventName, emailRequest.Date, emailRequest.EventAddress, emailRequest.EventImage);
                    await _emailService.SendEmailAsync(guest.Email, "Invitation to the event", "Dear Guest, you are invited to the event");
                    guest.InvitationState = "Sent";
                    await _repository.InsertOrUpdateAsync(MapToEntity(guest));
                    invitationCount++;
                }
            }

            return invitationCount;
        }
    }
    }