
﻿using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Event.Dto;


using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Abp.Application.Services;
using Event_Planning_System.Event;
using Event_Planning_System.Authorization.Users;
using Abp.Domain.Repositories;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc;

namespace Event_Planning_System.Event

{
    public class EventAppService : AsyncCrudAppService<Enitities.Event, EventDto, int>, IEventAppService
    {

        private readonly IRepository<Enitities.Event, int> _repository;
        private readonly IMapper _mapper;

        public EventAppService(IRepository<Enitities.Event, int> repository, IMapper mapper) : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<EventDto>> GetUserEventsAsync(long userId)
        {
            var events = await _repository.GetAllListAsync(e => e.UserId == userId);
            return _mapper.Map<List<EventDto>>(events);

        }
    }
}
