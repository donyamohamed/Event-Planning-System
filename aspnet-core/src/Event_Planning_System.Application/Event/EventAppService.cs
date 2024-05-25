using AutoMapper;
using Event_Planning_System.Event.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        public EventAppService(IRepository<Enitities.Event, int> repository) : base(repository)
        {
        }
    }
}
