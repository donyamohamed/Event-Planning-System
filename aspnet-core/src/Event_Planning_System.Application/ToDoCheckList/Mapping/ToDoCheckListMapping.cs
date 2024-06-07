using AutoMapper;
using Event_Planning_System.Event.Dto;
using Event_Planning_System.ToDoCheckList.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.ToDoCheckList.Mapping
{
    public class ToDoCheckListMapping : Profile
    {
        public ToDoCheckListMapping()
        {
            CreateMap<Enitities.ToDoCheckList, ToDoListDto>()
               .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            // Mapping from EventDto to Enitities.Event
            CreateMap<ToDoListDto, Enitities.ToDoCheckList>()
      .ForMember(dest => dest.Id, opt => opt.Ignore())
      .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<StatusList>(src.Status, true)));

        }
    }
}

