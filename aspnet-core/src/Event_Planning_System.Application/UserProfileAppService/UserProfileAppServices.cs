using Abp.Application.Services;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.UserProfile;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.UserProfileAppService
{
	public class UserProfileAppServices : ApplicationService, IUserProfileAppService
	{
		private readonly UserManager _userManager;
		private readonly IMapper _mapper;
		private readonly IWebHostEnvironment _hostingEnvironment;

		public UserProfileAppServices(UserManager userManager, IMapper mapper, IWebHostEnvironment hostingEnvironment)
		{
			_userManager = userManager;
			_mapper = mapper;
			_hostingEnvironment = hostingEnvironment;
		}
		public async Task<UserProfileDTO> GetUserProfile()
		{
			var userId = AbpSession.UserId.Value;
			var user = await _userManager.GetUserByIdAsync(userId);
			return _mapper.Map<UserProfileDTO>(user);
		}

		public async Task UpdateUserProfileData([FromForm]UpdateUserProfileDTO userProfileDTO)
		{

			string imagePath = null;
			if (userProfileDTO.ImagePath != null && userProfileDTO.ImagePath.Length > 0)
			{
				string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "ProfileImages");
				if (!Directory.Exists(uploadsFolder))
				{
					Directory.CreateDirectory(uploadsFolder);
				}

				string uniqueFileName = Guid.NewGuid().ToString() + "_" + userProfileDTO.ImagePath.FileName;
				string filePath = Path.Combine(uploadsFolder, uniqueFileName);

				using (var fileStream = new FileStream(filePath, FileMode.Create))
				{
					await userProfileDTO.ImagePath.CopyToAsync(fileStream);
				}

				imagePath = $"/ProfileImages/{uniqueFileName}";
			}

			var userId = AbpSession.UserId.Value;
			var user = await _userManager.GetUserByIdAsync(userId);

			_mapper.Map(userProfileDTO, user);
			if (imagePath != null)
			{

				user.Image = imagePath;
			}

			await _userManager.UpdateAsync(user);


		}
	}
}
