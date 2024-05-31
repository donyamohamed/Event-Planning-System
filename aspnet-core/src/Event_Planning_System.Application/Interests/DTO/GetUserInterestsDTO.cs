using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Users.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Interests.DTO
{
	public class GetUserInterestsDTO :EntityDto<int>
	{
		public int Id { get; set; }
		public EventCategory Type { get; set; }
		//public List<UserDto> Users { get; set; }
	}
}
