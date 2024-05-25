using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Abp.Authorization;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using Abp.Runtime.Security;
using Event_Planning_System.Authentication.JwtBearer;
using Event_Planning_System.Authorization;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Models.TokenAuth;
using Event_Planning_System.MultiTenancy;
using Event_Planning_System.Users.Dto;
using Microsoft.AspNetCore.Identity;
using PasswordGenerator;
using System.Net.Mail;
using System.Net;

namespace Event_Planning_System.Controllers
{
    [Route("api/[controller]/[action]")]
    public class TokenAuthController : Event_Planning_SystemControllerBase
    {
        private readonly LogInManager _logInManager;
        private readonly ITenantCache _tenantCache;
        private readonly AbpLoginResultTypeHelper _abpLoginResultTypeHelper;
        private readonly TokenAuthConfiguration _configuration;
        private readonly UserManager _userManager;
        private readonly IPasswordHasher<User> _passwordHasher;


        public TokenAuthController(
            LogInManager logInManager,
            ITenantCache tenantCache,
                        UserManager userManager,
            IPasswordHasher<User> passwordHasher,

            AbpLoginResultTypeHelper abpLoginResultTypeHelper,
            TokenAuthConfiguration configuration)
        {
            _userManager = userManager;
            _passwordHasher = passwordHasher;

            _logInManager = logInManager;
            _tenantCache = tenantCache;
            _abpLoginResultTypeHelper = abpLoginResultTypeHelper;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<AuthenticateResultModel> Authenticate([FromBody] AuthenticateModel model)
        {
            var loginResult = await GetLoginResultAsync(
                model.UserNameOrEmailAddress,
                model.Password,
                GetTenancyNameOrNull()
            );

            var accessToken = CreateAccessToken(CreateJwtClaims(loginResult.Identity));

            return new AuthenticateResultModel
            {
                AccessToken = accessToken,
                EncryptedAccessToken = GetEncryptedAccessToken(accessToken),
                ExpireInSeconds = (int)_configuration.Expiration.TotalSeconds,
                UserId = loginResult.User.Id
            };
        }

        private string GetTenancyNameOrNull()
        {
            if (!AbpSession.TenantId.HasValue)
            {
                return null;
            }

            return _tenantCache.GetOrNull(AbpSession.TenantId.Value)?.TenancyName;
        }

        [HttpPost]
        public async Task<bool> ResetPassword(ResetPasswordDto input)
        {

            var currentUser = await _userManager.FindByNameOrEmailAsync(input.UserEmail);

            if (currentUser == null)
            {
                throw new Exception("There is no current user!");
            }

            if (currentUser.IsDeleted || !currentUser.IsActive)
            {
                return false;
            }

            var pwd = new Password().IncludeLowercase().IncludeUppercase().IncludeSpecial();
            var NewPassword = pwd.Next();

            if (currentUser != null)
            {
                await _userManager.ChangePasswordAsync(currentUser, NewPassword);
                //currentUser.Password = _passwordHasher.HashPassword(currentUser, NewPassword);
                //await CurrentUnitOfWork.SaveChangesAsync();
                SendEmail(input.UserEmail, NewPassword);

            }

            return true;
        }

        private void SendEmail(string emailAddress, string newPassword)
        {

            string senderEmail = "opaaida@hotmail.com";
            string senderPassword = "1234565432121-";

            // Recipient's email address
            string recipientEmail = emailAddress;

            // SMTP server configuration for Hotmail (Outlook.com)
            var smtpClient = new SmtpClient("smtp-mail.outlook.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = true,
            };

            // Creating and configuring the email message
            var message = new MailMessage(senderEmail, recipientEmail)
            {
                Subject = "Test Email",
                Body = newPassword,
                IsBodyHtml = false // Change to true if your email body is HTML formatted
            };

            try
            {
                // Sending the email
                smtpClient.Send(message);
                Console.WriteLine("Email sent successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email. Error: {ex.Message}");
            }
        }


        private async Task<AbpLoginResult<Tenant, User>> GetLoginResultAsync(string usernameOrEmailAddress, string password, string tenancyName)
        {
            var loginResult = await _logInManager.LoginAsync(usernameOrEmailAddress, password, tenancyName);

            switch (loginResult.Result)
            {
                case AbpLoginResultType.Success:
                    return loginResult;
                default:
                    throw _abpLoginResultTypeHelper.CreateExceptionForFailedLoginAttempt(loginResult.Result, usernameOrEmailAddress, tenancyName);
            }
        }

        private string CreateAccessToken(IEnumerable<Claim> claims, TimeSpan? expiration = null)
        {
            var now = DateTime.UtcNow;

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _configuration.Issuer,
                audience: _configuration.Audience,
                claims: claims,
                notBefore: now,
                expires: now.Add(expiration ?? _configuration.Expiration),
                signingCredentials: _configuration.SigningCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }

        private static List<Claim> CreateJwtClaims(ClaimsIdentity identity)
        {
            var claims = identity.Claims.ToList();
            var nameIdClaim = claims.First(c => c.Type == ClaimTypes.NameIdentifier);

            // Specifically add the jti (random nonce), iat (issued timestamp), and sub (subject/user) claims.
            claims.AddRange(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, nameIdClaim.Value),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.Now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            });

            return claims;
        }

        private string GetEncryptedAccessToken(string accessToken)
        {
            return SimpleStringCipher.Instance.Encrypt(accessToken);
        }
    }
}
