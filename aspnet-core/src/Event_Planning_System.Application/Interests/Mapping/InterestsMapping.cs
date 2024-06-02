using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Enitities;
using Event_Planning_System.Interests.DTO;
using Event_Planning_System.Users.Dto;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Event.Dto;


namespace Event_Planning_System.Interests.Mapping
{
	public class InterestsMapping : Profile
	{
		public InterestsMapping()
		{
            CreateMap<User, UserDto>();
			CreateMap<Interest, GetUserInterestsDTO>();
            //.ForMember(dest => dest.Users, opt => opt.MapFrom(src => src.Users));

            // Mapping from GetAllInterstsDTO to Enitities.Interest
            CreateMap<GetAllInterstsDTO , Enitities.Interest>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => Enum.Parse<EventCategory>(src.Type, true)));

            // Mapping from Enitities.Interest to GetAllInterstsDTO
            CreateMap<Enitities.Interest, GetAllInterstsDTO>()
           .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));
           
        }
	}
}
