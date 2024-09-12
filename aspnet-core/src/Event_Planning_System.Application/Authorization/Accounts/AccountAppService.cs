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
using Microsoft.Extensions.Logging;

namespace Event_Planning_System.Authorization.Accounts
{
    public class AccountAppService : Event_Planning_SystemAppServiceBase, IAccountAppService
    {
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly IEmailService _emailService;
        private readonly UserManager _userManager;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly ILogger<AccountAppService> _logger;

        public AccountAppService(
            UserRegistrationManager userRegistrationManager,
            UserManager userManager,
            IEmailService emailService,
            IWebHostEnvironment hostingEnvironment,
            ICloudinaryService cloudinaryService,
         ILogger<AccountAppService> logger)
        {
            _userRegistrationManager = userRegistrationManager;
            _emailService = emailService;
            _userManager = userManager;
            _hostingEnvironment = hostingEnvironment;
            _cloudinaryService = cloudinaryService;
            _logger=logger;
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
        public async Task<RegisterOutput> Register([FromForm] RegisterInput input, [FromQuery] bool Supplier )
        {
            _logger.LogInformation($"Register method called with Supplier: {Supplier}");
            string imagePath = null;

            try
            {
                var existingUser = await _userManager.FindByEmailAsync(input.EmailAddress);
                if (existingUser != null)
                {
                    throw new UserFriendlyException("The email already exists.");
                }

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

                // Assign the "Supplier" role if the Supplier flag is true
                if (Supplier)
                {
                    await _userManager.SetRolesAsync(user, new[] { "Supplier" });
                }

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
            var emailBodyTemplate = $@"
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                background-color: #007bff;
                color: #ffffff;
                padding: 10px;
                text-align: center;
            }}
            .content {{
                padding: 20px;
                font-size: 16px;
                line-height: 1.6;
            }}
            .button {{
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }}
            .footer {{
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #777777;
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Welcome to Our Service!</h1>
            </div>
            <div class='content'>
                <p>Hi {user.Name},</p>
                <p>Thank you for registering! To complete your registration, please click the button below to activate your account:</p>
                <a href='{activationLink}' class='button'>Activate Your Account</a>
                <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
                <p><a href='{activationLink}'>{activationLink}</a></p>
            </div>
            <div class='footer'>
                <p>If you did not register for this account, please ignore this email.</p>
                <p>&copy; 2024 Eventa. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>";

            await _emailService.SendEmailAsync(user.EmailAddress, "Registration Confirmation", emailBodyTemplate);
        }

        public async Task CreateSupplierAccount(string email)
        {
            var emailBodyTemplate = @"
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f6f6f6;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #4CAF50;
                color: #ffffff;
                text-align: center;
                padding: 10px 0;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                line-height: 1.6;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                color: #777777;
                font-size: 12px;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                color: #ffffff;
                background-color: #4CAF50;
                text-decoration: none;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Supplier Account Registration</h1>
            </div>
            <div class='content'>
                <p>Dear Valued Partner,</p>
                <p>Thank you for your interest in becoming a supplier! We are excited to have you join our platform.</p>
                <p>To get started, please click the button below to create your supplier account:</p>
                <p style='text-align: center;'>
                    <a href='http://localhost:4200/account/register?Supplier=true' class='button'>Create Supplier Account</a>
                </p>
                <p>If the button above does not work, you can copy and paste the following link into your web browser:</p>
                <p><a href='http://localhost:4200/account/register?Supplier=true'>http://localhost:4200/account/register?Supplier=true</a></p>
                <p>Best regards,<br>Eventa</p>
            </div>
            <div class='footer'>
                <p>&copy; 2024 Eventa. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>";

            await _emailService.SendEmailAsync(email, "Supplier Account Registration", emailBodyTemplate);
        }


    }
}
