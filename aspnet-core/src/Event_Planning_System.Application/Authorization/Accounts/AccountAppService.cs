using System;
using System.IO;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Configuration;
using Abp.Zero.Configuration;
using Event_Planning_System.Authorization.Accounts.Dto;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Email;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Event_Planning_System.Authorization.Accounts
{
    public class AccountAppService : Event_Planning_SystemAppServiceBase, IAccountAppService
    {
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IEmailService _emailService;
        private readonly UserManager _userManager;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public AccountAppService(
            UserRegistrationManager userRegistrationManager,
            UserManager userManager,
            IEmailService emailService,
            IWebHostEnvironment hostingEnvironment)
        {
            _userRegistrationManager = userRegistrationManager;
            _emailService = emailService;
            _userManager = userManager;
            _hostingEnvironment = hostingEnvironment;
        }

        [AbpAllowAnonymous]
        public async Task<bool> SendResetPasswordLink(string emailAddress)
        {
            var user = await _userManager.FindByNameOrEmailAsync(emailAddress);

            if (user == null)
                throw new Exception("There is no current user!");
            else
            if (user.IsDeleted || !user.IsActive)
                return false;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = Uri.EscapeDataString(token);

            var callbackUrl = $"http://localhost:4200/account/newPassword?token={encodedToken}&email={user.EmailAddress}" ;
            var emailBodyTemplate = $"Please reset your password by clicking here: <a href='{callbackUrl}'>here</a>";

            await _emailService.SendEmailAsync(emailAddress, "Reset Password", emailBodyTemplate);

            return true;
        }


        [AbpAllowAnonymous]
        public async Task<IdentityResult> ResetPassword(string token, string email,ResetPasswordDto model)
        {

            var user = await _userManager.FindByNameOrEmailAsync(email);

            if (user == null)
                throw new Exception("There is no current user!");
  
            else
            if (model.NewPassword != model.ConfirmPassword)
                throw new Exception("No matched password");


            return await _userManager.ResetPasswordAsync(user, token, model.NewPassword);
        }

        ///

        public async Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input)
        {
            var tenant = await TenantManager.FindByTenancyNameAsync(input.TenancyName);
            if (tenant == null)
            {
                return new IsTenantAvailableOutput(TenantAvailabilityState.NotFound);
            }

            if (!tenant.IsActive)
            {
                return new IsTenantAvailableOutput(TenantAvailabilityState.InActive);
            }

            return new IsTenantAvailableOutput(TenantAvailabilityState.Available, tenant.Id);
        }

        [AbpAllowAnonymous]
        public async Task<RegisterOutput> Register([FromForm] RegisterInput input)
        {
            string imagePath = null;

            try
            {
                if (input.ImageFile != null && input.ImageFile.Length > 0)
                {
                    string uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "ProfileImages");
                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + input.ImageFile.FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await input.ImageFile.CopyToAsync(fileStream);
                    }

                    imagePath = "/ProfileImages/" + uniqueFileName;
                }

                var user = await _userRegistrationManager.RegisterAsync(
                    input.Name,
                    input.Surname,
                    input.EmailAddress,
                    input.UserName,
                    input.Password,
                    input.Age,
                    input.Gender,
                    imagePath,
                    false
                );

                await SendRegistrationConfirmationEmail(user);

                var isEmailConfirmationRequiredForLogin = await SettingManager.GetSettingValueAsync<bool>(AbpZeroSettingNames.UserManagement.IsEmailConfirmationRequiredForLogin);
                var output = new RegisterOutput
                {
                    CanLogin = user.IsActive && (user.IsEmailConfirmed || !isEmailConfirmationRequiredForLogin),
                    ProfileImage = imagePath
                    
                };

                return output;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //public Task<RegisterOutput> Register(RegisterInput input)
        //{
        //    throw new NotImplementedException();
        //}

        private async Task SendRegistrationConfirmationEmail(User user)
        {
            var activationLink = $"http://localhost:4200/account/activate/{user.Id}";
            var emailBodyTemplate = $"Thank you for registering! Click <a href='{activationLink}'>here</a> to activate your account.";

            await _emailService.SendEmailAsync(user.EmailAddress, "Registration Confirmation", emailBodyTemplate);
        }
    }
}
