﻿using AutoMapper;

using Event_Planning_System.Enitities;
using Event_Planning_System.Event.Dto;
using Event_Planning_System.Notification.Dto;
using System;

namespace Event_Planning_System.Event.Mapping
{
    public class EventMappingProfile : Profile
    {
        public EventMappingProfile()
        {
			CreateMap<Enitities.Event, UpdateEventStatusDto>();

			// Mapping from Enitities.Event to EventDto
			CreateMap<Enitities.Event, EventDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.ToString()));

            // Mapping from EventDto to Enitities.Event
            CreateMap<EventDto, Enitities.Event>()

         .ForMember(dest => dest.Id, opt => opt.Ignore())
         .ForMember(dest => dest.Category, opt => opt.MapFrom(src => Enum.Parse<EventCategory>(src.Category, true)));
            CreateMap<CreateEventDto, Enitities.Event>()
               .ForMember(dest => dest.Category, opt => opt.MapFrom(src => Enum.Parse<EventCategory>(src.Category)));

            CreateMap<Enitities.Event, CreateEventDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.ToString()));
        }

        }
    }
