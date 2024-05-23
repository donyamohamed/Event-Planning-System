using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.UserProfile;
using Event_Planning_System.UserProfileAppService;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
	[Microsoft.AspNetCore.Components.Route("api/[controller]/[action]")]
	public class UserProfileController : AbpController
	{
		private readonly IUserProfileAppService userProfileAppService;

		public UserProfileController(IUserProfileAppService _userProfileAppService)
		{
			userProfileAppService = _userProfileAppService;
		}
		[HttpGet]
		public async Task<UserProfileDTO> GetUserProfile()
		{
			return await userProfileAppService.GetUserProfile();
		}
		[HttpPost]
		public async Task UpdateUserProfileData([FromBody] UpdateUserProfileDTO userProfileDTO)
		{
			await userProfileAppService.UpdateUserProfileData(userProfileDTO);
		}
	}
}
