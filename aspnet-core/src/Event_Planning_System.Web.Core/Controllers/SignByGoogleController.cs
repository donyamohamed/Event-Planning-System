using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Authorization.Accounts.Dto;
using Event_Planning_System.Authorization.Users;
using Abp.Authorization;
using Abp.AspNetCore.Mvc.Controllers;
using Microsoft.IdentityModel.Tokens;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;

namespace Event_Planning_System.Web.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignByGoogleController : AbpController
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager _userManager;
        private readonly UserRegistrationManager _userRegistrationManager;
        private readonly ILogger<SignByGoogleController> _logger;

        public SignByGoogleController(ILogger<SignByGoogleController> logger,
                                      UserRegistrationManager userRegistrationManager,
                                      IConfiguration configuration,
                                      UserManager userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
            _userRegistrationManager = userRegistrationManager;
            _logger = logger;
        }

        [HttpPost("googleSign")]
        [AbpAllowAnonymous]
        public async Task<IActionResult> RegisterByGoogle([FromBody] GoogleRegisterInputs inputs)
        {
            try
            {
                var payload = await VerifyGoogleToken(inputs.Token);

                if (payload == null)
                {
                    return BadRequest("Invalid Google token.");
                }

                var email = payload.Email;
                var existingUser = await _userManager.FindByEmailAsync(email);

                if (existingUser != null)
                {
                    var token = GenerateJwtToken(existingUser);
                    return Ok(new { Token = token });
                }

                if (!payload.EmailVerified)
                {
                    return BadRequest("Email is not verified by Google.");
                }

                string name = payload.Name ?? ExtractNameFromEmail(email);
                string surname = GenerateUniqueSurname(name);

                var user = await _userRegistrationManager.RegisterAsync(
                    name,
                    surname,
                    email,
                    surname,
                    Guid.NewGuid().ToString(), 
                    0, // Age 
                    Gender.Female,
                    null, // PictureUrl 
                    true // 
                );

                var jwtToken = GenerateJwtToken(user);

                return Ok(new { Token = jwtToken });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Registration by Google failed");
                return StatusCode(500, $"Registration by Google failed: {ex.Message}");
            }
        }

        private async Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string token)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _configuration["Authentication:Google:ClientId"] }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                return payload;
            }
            catch (InvalidJwtException ex)
            {
                _logger.LogError(ex, "Invalid JWT token");
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying Google token");
                return null;
            }
        }

        private string ExtractNameFromEmail(string email)
        {
            var namePart = email.Split('@')[0];
            var nameParts = namePart.Split('.');
            for (int i = 0; i < nameParts.Length; i++)
            {
                nameParts[i] = char.ToUpper(nameParts[i][0]) + nameParts[i].Substring(1).ToLower();
            }
            return string.Join("_", nameParts);
        }

        private string GenerateUniqueSurname(string baseName)
        {
            return $"{baseName}{Guid.NewGuid().ToString().Substring(0, 4)}";
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Authentication:JwtBearer:SecurityKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.EmailAddress),
                    new Claim(ClaimTypes.Name, user.Name)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Authentication:JwtBearer:Issuer"],
                Audience = _configuration["Authentication:JwtBearer:Audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
