﻿using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using Event_Planning_System.Guest.Dto;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Event_Planning_System.Guest
{
    public class GuestAppService : AsyncCrudAppService<Enitities.Guest, GuestDto, int>, IGuestAppService
    {

        private readonly IRepository<Enitities.Guest, int> _repository;
        private readonly IRepository<Enitities.Event, int> _repositoryEvent;
        private readonly IMapper _mapper;
        private readonly IRepository<User, long> _userRepository;

        public GuestAppService(IRepository<Enitities.Guest, int> repository, IRepository<Enitities.Event, int> repositoryEvent, IRepository<User, long> userRepository, IMapper mapper) : base(repository)
        {
            _repository = repository;
            _repositoryEvent = repositoryEvent;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        public async Task<List<GuestDto>> GetEventGuestsAsync(int eventId)
        {
            var guests = await _repository.GetAllListAsync(g => g.Events.Any(e => e.Id == eventId));
            return _mapper.Map<List<GuestDto>>(guests);
        }



        //public async Task<IActionResult> AddGuestsThroughExcelFile([FromForm] IFormFile file, int eventId)
        //{
        //    try
        //    {
        //        var userId = AbpSession.UserId.Value;
        //        var user = await _userRepository.GetAllIncluding(u => u.Guests).FirstOrDefaultAsync(u => u.Id == userId);

        //        if (user == null)
        //        {
        //            throw new Exception("User not found.");
        //        }

        //        var eventUser = await _repositoryEvent.GetAllIncluding(e => e.Guests).FirstOrDefaultAsync(e => e.Id == eventId && e.UserId == userId);

        //        if (eventUser == null)
        //        {
        //            throw new Exception("Event not found or does not belong to the user.");
        //        }

        //        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        //        if (file == null || file.Length == 0)
        //            return new BadRequestObjectResult("No File uploaded");

        //        var uploadsFolder = $"{Directory.GetCurrentDirectory()}";
        //        if (!Directory.Exists(uploadsFolder))
        //        {
        //            Directory.CreateDirectory(uploadsFolder);
        //        }

        //        var filePath = Path.Combine(uploadsFolder, file.FileName);

        //        using (var stream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await file.CopyToAsync(stream);
        //        }

        //        var guestList = new List<GuestDto>();

        //        using (var stream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read))
        //        {
        //            using (var reader = ExcelReaderFactory.CreateReader(stream))
        //            {
        //                reader.Read(); // Skip the header row

        //                while (reader.Read())
        //                {
        //                    var guest = new GuestDto
        //                    {
        //                        Name = reader.GetValue(0)?.ToString(),
        //                        Phone = reader.GetValue(1)?.ToString(),
        //                        InvitationState = reader.GetValue(2)?.ToString(),
        //                        Email = reader.GetValue(3)?.ToString(),
        //                        UserId = userId,
        //                        EventId = eventId

        //                    };

        //                    guestList.Add(guest);
        //                }
        //            }
        //        }

        //        foreach (var guestDto in guestList)
        //        {
        //            if (!eventUser.Guests.Any(g => g.Email == guestDto.Email)) // Check for existing guest by Email within the event
        //            {
        //                var entity = _mapper.Map<Enitities.Guest>(guestDto);
        //                eventUser.Guests.Add(entity);
        //                user.Guests.Add(entity);
        //            }
        //        }

        //        await _repositoryEvent.UpdateAsync(eventUser);
        //        await _userRepository.UpdateAsync(user);

        //        return new OkObjectResult("Successfully inserted");
        //    }
        //    catch (Exception ex)
        //    {
        //        return new ObjectResult(ex.Message) { StatusCode = 500 };
        //    }
        //}

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
                    return new BadRequestObjectResult("No File uploaded");

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, file.FileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }


                var guestList = new List<GuestDto>();


                using (var stream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read))
                {
                    using (var reader = ExcelReaderFactory.CreateReader(stream))
                    {

                        reader.Read(); // Skip the header row


                        while (reader.Read())
                        {
                            var guest = new GuestDto
                            {

                                Name = reader.GetValue(0)?.ToString(),
                                Phone = reader.GetValue(1)?.ToString(),
                                InvitationState = reader.GetValue(2)?.ToString(),
                                Email = reader.GetValue(3)?.ToString(),
                                UserId = userId,
                                EventId = eventId
                            };

                            guestList.Add(guest);
                        }

                    }
                }

                foreach (var guestDto in guestList)
                {
                    if (!eventUser.Guests.Any(g => g.Email == guestDto.Email)) // Check for existing guest by Email within the event
                    {
                        var entity = _mapper.Map<Enitities.Guest>(guestDto);
                        eventUser.Guests.Add(entity);
                        user.Guests.Add(entity);
                    }
                }

                await _repositoryEvent.UpdateAsync(eventUser);
                await _userRepository.UpdateAsync(user);


                return new OkObjectResult("Successfully inserted");
            }
            catch (Exception ex)
            {
                return new ObjectResult(ex.Message) { StatusCode = 500 };
            }
        }
    }
}
