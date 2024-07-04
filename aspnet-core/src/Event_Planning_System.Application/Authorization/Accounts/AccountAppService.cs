using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Configuration;
using Abp.UI;
using Abp.Zero.Configuration;
using Event_Planning_System.Authorization.Accounts.Dto;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Email;
using Event_Planning_System.Image;
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
        private readonly ICloudinaryService _cloudinaryService;

        public AccountAppService(
            UserRegistrationManager userRegistrationManager,
            UserManager userManager,
            IEmailService emailService,
            IWebHostEnvironment hostingEnvironment,
            ICloudinaryService cloudinaryService)
        {
            _userRegistrationManager = userRegistrationManager;
            _emailService = emailService;
            _userManager = userManager;
            _hostingEnvironment = hostingEnvironment;
            _cloudinaryService = cloudinaryService;
        }

        [AbpAllowAnonymous]
        public async Task<IActionResult> SendResetPasswordLink(string emailAddress)
        {
            string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

            if (string.IsNullOrWhiteSpace(emailAddress) || emailAddress == "undefined")
            {
                return new BadRequestObjectResult("Email cannot be null or undefined");
            }
            if (!Regex.IsMatch(emailAddress, emailPattern))
            {
                return new BadRequestObjectResult("Invalid Email Format");
            }

            var user = await _userManager.FindByNameOrEmailAsync(emailAddress);
            if (user == null)
            {
                return new BadRequestObjectResult("User not found");
            }
            if (user.IsDeleted || !user.IsActive)
            {
                return new BadRequestObjectResult("The user is either deleted or inactive");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = Uri.EscapeDataString(token);

            var callbackUrl = $"http://localhost:4200/account/newPassword?token={encodedToken}&email={user.EmailAddress}";
            var emailBodyTemplate = $"Please reset your password by clicking <a href='{callbackUrl}'>here</a>";

            await _emailService.SendEmailAsync(emailAddress, "Reset Password", emailBodyTemplate);

            return new OkObjectResult("The email was sent successfully");
        }

        [AbpAllowAnonymous]
        public async Task<IdentityResult> ResetPassword(string token, string email, ResetPasswordDto model)
        {
            var user = await _userManager.FindByNameOrEmailAsync(email);
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "InvalidUser",
                    Description = "No user found with the provided email"
                });
            }

            var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";
            if (!Regex.IsMatch(model.NewPassword, passwordPattern))
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "InvalidPassword",
                    Description = "Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character."
                });
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return IdentityResult.Failed(new IdentityError
                {
                    Code = "PasswordsDoNotMatch",
                    Description = "New password and confirm password do not match"
                });
            }

            return await _userManager.ResetPasswordAsync(user, token, model.NewPassword);
        }

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
                    // Upload image to Cloudinary
                    using (var memoryStream = new MemoryStream())
                    {
                        await input.ImageFile.CopyToAsync(memoryStream);
                        memoryStream.Position = 0; // Reset stream position before uploading

                        string fileName = Guid.NewGuid().ToString() + "_" + input.ImageFile.FileName;

                        var uploadResult = await _cloudinaryService.UploadImageAsync(memoryStream, fileName);
                        if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                        {
                            imagePath = uploadResult.SecureUrl.ToString(); // Cloudinary URL of uploaded image
                        }
                        else
                        {
                            throw new Exception($"Failed to upload image to Cloudinary: {uploadResult.Error.Message}");
                        }
                    }
                }

                var passwordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";
                string emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

                if (!Regex.IsMatch(input.EmailAddress, emailPattern))
                {
                    throw new UserFriendlyException("Invalid Email Format");
                }

                if (!Regex.IsMatch(input.Password, passwordPattern))
                {
                    throw new UserFriendlyException("Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character.");
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
            catch (UserFriendlyException ex)
            {
                throw new UserFriendlyException(ex.Message);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException("An unexpected error occurred during registration. Please try again.");
            }
        }

        private async Task SendRegistrationConfirmationEmail(User user)
        {
            var activationLink = $"http://localhost:4200/account/activate/{user.Id}";
            var emailBodyTemplate = $"Thank you for registering! Click <a href='{activationLink}'>here</a> to activate your account.";

            await _emailService.SendEmailAsync(user.EmailAddress, "Registration Confirmation", emailBodyTemplate);
        }
    }
}
