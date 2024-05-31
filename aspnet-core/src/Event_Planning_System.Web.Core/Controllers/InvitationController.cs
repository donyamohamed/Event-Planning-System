using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Email;
using Event_Planning_System.SMS;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
    [Route("api/[controller]/[action]")]
    public class InvitationController : AbpController
    {
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly ILogger<InvitationController> _logger;

        public InvitationController(IEmailService emailService, ILogger<InvitationController> logger, ISmsService smsService)
        {
            _emailService = emailService;
            _logger = logger;
            _smsService = smsService;
        }

        
        [HttpPost]
        public async Task<IActionResult> SendInvitationByEmail([FromBody] EmailRequest emailRequest)
        {
            try
            {
                if (emailRequest == null)
                {
                    return BadRequest("Invalid email request.");
                }

                if (string.IsNullOrEmpty(emailRequest.Subject) || string.IsNullOrEmpty(emailRequest.Body))
                {
                    return BadRequest("Email subject and body cannot be empty.");
                }

               
                var htmlBody = EmailTemplate.GetInvitationEmail(emailRequest.EventName, emailRequest.Date,emailRequest.EventAddress);

                await _emailService.SendEmailAsync(emailRequest.ToEmail, emailRequest.Subject, htmlBody);
                _logger.LogInformation("Invitation email sent successfully.");
                return Ok("Invitation email sent successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending invitation email.");
                return StatusCode(500, "Internal server error");
            }
        }
       

        [HttpPost()]
        public async Task<IActionResult> SendInvitationBySms([FromBody] SmsRequest smsRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _smsService.SendSmsAsync(smsRequest);
            return Ok(new { message = "SMS sent successfully!" });
        }
    }
}

