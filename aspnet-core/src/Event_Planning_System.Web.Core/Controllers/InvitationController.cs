using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Email;
using Event_Planning_System.Guest;
using Event_Planning_System.SMS;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Web;

namespace Event_Planning_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvitationController : AbpController
    {
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly ILogger<InvitationController> _logger;
        private readonly GuestAppService _guestAppService;
        private const string BaseUrl = "https://eventa.azurewebsites.net";

        public InvitationController(IEmailService emailService, ILogger<InvitationController> logger, ISmsService smsService, GuestAppService guestService)
        {
            _emailService = emailService;
            _logger = logger;
            _smsService = smsService;
            _guestAppService = guestService;
        }

        [HttpPost("SendInvitationByEmail")]
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

                // Ensure URL encoding for parameters
                var encodedEventName = HttpUtility.UrlEncode(emailRequest.EventName);
                var encodedEventAddress = HttpUtility.UrlEncode(emailRequest.EventAddress);
                var encodedEventImg = HttpUtility.UrlEncode(emailRequest.EventImage);

                var downloadUrl = $"{BaseUrl}/api/pdf/DownloadInvitation?eventName={encodedEventName}&date={emailRequest.Date:yyyy-MM-ddTHH:mm:ss}&eventAddress={encodedEventAddress}&eventImg={encodedEventImg}";
                var htmlBody = EmailTemplate.GetInvitationEmail(emailRequest.EventName, emailRequest.Date, emailRequest.EventAddress, emailRequest.EventImage, downloadUrl);

                await _emailService.SendEmailAsync(emailRequest.ToEmail, emailRequest.Subject, htmlBody);
                _logger.LogInformation("Invitation email sent successfully.");

                // Update the guest's invitation state to Sent
                var guest = await _guestAppService.GetGuestByEmailAsync(emailRequest.ToEmail);
                if (guest != null)
                {
                    await _guestAppService.UpdateInvitationState(guest.Id, "Sent");
                }

                return Ok("Invitation email sent successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending invitation email.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("SendInvitationBySms")]
        public async Task<IActionResult> SendInvitationBySms([FromBody] SmsRequest smsRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _smsService.SendSmsAsync(smsRequest);
            return Ok(new { message = "SMS sent successfully!" });
        }

        [HttpPost("SendPendingEmail")]
        public async Task<IActionResult> SendPendingEmail([FromBody] EmailRequest emailRequest)
        {
            string[] emailParts = emailRequest.ToEmail?.Split('@');
            string guestName = emailParts != null && emailParts.Length > 0 ? emailParts[0] : "Guest";

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

                var htmlBody = EmailPendingTemple.YourInvitationRequestPending(emailRequest.EventName, emailRequest.Date, emailRequest.EventAddress, guestName, emailRequest.Body, emailRequest.EventImage);

                await _emailService.SendEmailAsync(emailRequest.ToEmail, emailRequest.Subject, htmlBody);
                _logger.LogInformation("Pending invitation email sent successfully.");
                return Ok("Pending invitation email sent successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending pending invitation email.");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("SendAcceptanceEmail")]
        public async Task<IActionResult> SendAcceptanceEmail([FromBody] EmailRequest emailRequest)
        {
            string[] emailParts = emailRequest.ToEmail.Split('@');
            string guestName = emailParts[0];
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

                var htmlBody = EmailAcceptedTemple.YourInvitationRequestAccepted(emailRequest.EventName, emailRequest.Date, emailRequest.EventAddress, guestName, emailRequest.EventImage);

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

        [HttpPost("SendRejectionEmail")]
        public async Task<IActionResult> SendRejectionEmail([FromBody] EmailRequest emailRequest)
        {
            string[] emailParts = emailRequest.ToEmail.Split('@');
            string guestName = emailParts[0];
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

                var htmlBody = EmailRejectedTemple.YourInvitationRequestRejected(emailRequest.EventName, emailRequest.Date, emailRequest.EventAddress, guestName, emailRequest.EventImage);

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
    }
}
