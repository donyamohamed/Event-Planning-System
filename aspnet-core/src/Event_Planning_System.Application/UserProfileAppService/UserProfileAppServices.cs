using Abp.Application.Services;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.UserProfile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.UserProfileAppService
{
	public class UserProfileAppServices : ApplicationService, IUserProfileAppService
	{
		private readonly UserManager _userManager;
		private readonly IMapper _mapper;

		public UserProfileAppServices(UserManager userManager, IMapper mapper)
		{
			_userManager = userManager;
			_mapper = mapper;
		}
		public async Task<UserProfileDTO> GetUserProfile()
		{
			var userId = AbpSession.UserId.Value;
			var user = await _userManager.GetUserByIdAsync(userId);
			return _mapper.Map<UserProfileDTO>(user);
		}

		public async Task UpdateUserProfileData(UpdateUserProfileDTO userProfileDTO)
		{
			var userId = AbpSession.UserId.Value;
			var user = await _userManager.GetUserByIdAsync(userId);

			_mapper.Map(userProfileDTO, user);
			await _userManager.UpdateAsync(user);
		}
	}
}
