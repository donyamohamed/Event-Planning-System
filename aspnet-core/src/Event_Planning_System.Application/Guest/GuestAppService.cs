﻿using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using Event_Planning_System.EntityFrameworkCore;
using Event_Planning_System.Event.Dto;
using Event_Planning_System.Guest.Dto;
using Event_Planning_System.UserProfile;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Guest
{
    public class GuestAppService : AsyncCrudAppService<Enitities.Guest, GuestDto, int>, IGuestAppService
    {

        private readonly IRepository<Enitities.Guest, int> _repository;
        private readonly IMapper _mapper;

        public GuestAppService(IRepository<Enitities.Guest, int> repository, IMapper mapper) : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<GuestDto>> GetEventGuestsAsync(int eventId)
        {
            var guests = await _repository.GetAllListAsync(g => g.Events.Any(e => e.Id == eventId));
            return _mapper.Map<List<GuestDto>>(guests);
        }

    }
}
