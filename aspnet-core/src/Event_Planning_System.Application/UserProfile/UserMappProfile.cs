using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace Event_Planning_System.UserProfile
{
	public class UserMappProfile : Profile
	{
		public UserMappProfile()
		{
			CreateMap<User, UserProfileDTO>();
			CreateMap<UpdateUserProfileDTO, User>().ForMember(x => x.Roles, opt => opt.Ignore())
					.ForMember(x => x.CreationTime, opt => opt.Ignore());
		}
	}
}
