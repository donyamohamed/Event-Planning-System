using AutoMapper;
using Event_Planning_System.Event.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Event.Mapping
{
    public class EventMappingProfile:Profile
    {
        public EventMappingProfile()
        {
            CreateMap<Enitities.Event, EventDto>();
            CreateMap<EventDto, Enitities.Event>()
                .ForMember(e => e.Id, P => P.Ignore());

        }
    }
}
