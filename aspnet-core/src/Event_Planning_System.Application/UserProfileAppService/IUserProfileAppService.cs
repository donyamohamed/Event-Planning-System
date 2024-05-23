using Event_Planning_System.UserProfile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.UserProfileAppService
{
	public interface IUserProfileAppService
	{
		Task<UserProfileDTO> GetUserProfile();
		Task UpdateUserProfileData(UpdateUserProfileDTO userProfileDTO);
	}
}
