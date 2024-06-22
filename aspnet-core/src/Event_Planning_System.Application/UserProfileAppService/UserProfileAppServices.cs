using Abp.Application.Services;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Image;
using Event_Planning_System.UserProfile;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Event_Planning_System.UserProfileAppService
{
    public class UserProfileAppServices : ApplicationService, IUserProfileAppService
    {
        private readonly UserManager _userManager;
        private readonly IMapper _mapper;
        private readonly ICloudinaryService _cloudinaryService;

        public UserProfileAppServices(UserManager userManager, IMapper mapper, ICloudinaryService cloudinaryService)
        {
            _userManager = userManager;
            _mapper = mapper;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<UserProfileDTO> GetUserProfile()
        {
            var userId = AbpSession.UserId.Value;
            var user = await _userManager.GetUserByIdAsync(userId);
            return _mapper.Map<UserProfileDTO>(user);
        }

        public async Task UpdateUserProfileData([FromForm] UpdateUserProfileDTO userProfileDTO)
        {
            string imagePath = null;

            if (userProfileDTO.ImagePath != null && userProfileDTO.ImagePath.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await userProfileDTO.ImagePath.CopyToAsync(memoryStream);
                    memoryStream.Position = 0; // Reset stream position before passing to UploadImageAsync

                    var uploadResult = await _cloudinaryService.UploadImageAsync(memoryStream, userProfileDTO.ImagePath.FileName);
                    imagePath = uploadResult.SecureUrl.AbsoluteUri;
                }
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
