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


namespace Event_Planning_System.Interests.Mapping
{
	public class InterestsMapping : Profile
	{
		public InterestsMapping()
		{
			CreateMap<Interest, GetUserInterestsDTO>();
			   //.ForMember(dest => dest.Users, opt => opt.MapFrom(src => src.Users));

			CreateMap<User, UserDto>();

		}
	}
}
