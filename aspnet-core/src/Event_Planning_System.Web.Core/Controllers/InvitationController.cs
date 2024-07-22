using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Email;
using Event_Planning_System.Guest;
using Event_Planning_System.SMS;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Web;
using Event_Planning_System.Controllers;
using DinkToPdf.Contracts;
using static System.Net.WebRequestMethods;


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
        private readonly IConverter _converter;
        private const string BaseUrl = "https://localhost:44311";

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
                var encodedGuestName = HttpUtility.UrlEncode(emailRequest.GuestName);
                var encodedEventImg = emailRequest.EventImage != null ? HttpUtility.UrlEncode(emailRequest.EventImage) : HttpUtility.UrlEncode("https://media.licdn.com/dms/image/C561BAQE-51J-8KkMZg/company-background_10000/0/1584559866970/eventscom_cover?e=2147483647&v=beta&t=8NsL_HPkr3nHk4ppAg8MkUoiYPUIf082mpMvySv5C7o");
                var backgroundImage = emailRequest.EventImage != null ? emailRequest.EventImage : "https://media.licdn.com/dms/image/C561BAQE-51J-8KkMZg/company-background_10000/0/1584559866970/eventscom_cover?e=2147483647&v=beta&t=8NsL_HPkr3nHk4ppAg8MkUoiYPUIf082mpMvySv5C7o";
                var downloadUrl = $"http://localhost:4200/app/sentemail?eventName={encodedEventName}&date={emailRequest.Date:yyyy-MM-ddTHH:mm:ss}&eventAddress={encodedEventAddress}&eventImg={encodedEventImg}&guestName={encodedGuestName}";

                // Construct HTML email content
                string htmlBody = $@"
<html>
<head>
    <style>
       @import url('https://fonts.googleapis.com/css2?family=Catamaran:wght@900&family=PT+Sans+Narrow&display=swap');

*,
::before,
::after {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    min-height: 100vh;
    display: grid;
    place-items: center;
    background-color: #f5f5f5;
    font-family: 'PT Sans Narrow', sans-serif;
}}

.poster {{
    max-width: 700px;
    width: 100%;
    background-color: #ffffff;
    border: 2px solid #000000;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    color: #333333;
    overflow: hidden;
    text-align: center;
    padding: 20px;
}}

.header-img {{
    width: 100%;
    height: 0;
    padding-bottom: 50%;
    background-image: url('{backgroundImage}');
    background-size: cover;
    background-position: center;
    border-radius: 10px 10px 0 0;
}}

.poster h1 {{
    font-family: 'Catamaran', sans-serif;
    font-size: 2.5rem;
    margin: 20px 0;
    color: #fbaf1b;
}}

.poster h2 {{
    font-family: 'Catamaran', sans-serif;
    font-size: 2rem;
    margin: 10px 0;
}}

.poster .date-time {{
    font-size: 1.5rem;
    margin: 20px 0;
}}

.poster .date-time span {{
    display: inline-block;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin: 5px;
    color: #333333;
}}

.poster .venue {{
    margin: 20px 0;
}}

.poster .venue h3 {{
    font-size: 1.75rem;
    margin-bottom: 10px;
}}

.poster .venue p {{
    font-size: 1.25rem;
    margin: 0;
}}

.download-btn {{
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1rem;
    color: #ffffff;
    background-color: #fbaf1b;
    text-decoration: none;
    border-radius: 5px;
}}
    </style>
</head>
<body>
    <div class='poster'>
        <div class='header-img'></div>
        <h1>Dear {emailRequest.GuestName},</h1>
        <h2>You're Invited!</h2>
        <h3>{emailRequest.EventName}</h3>
        <div class='date-time'>
            <span>{emailRequest.Date:HH:mm}</span>
            <span>{emailRequest.Date:dd}</span>
            <span>{emailRequest.Date:MMM}</span>
            <span>{emailRequest.Date:yyyy}</span>
        </div>
        <div class='venue'>
            <h3>Event Location</h3>
            <p>{emailRequest.EventAddress}</p>
        </div>
        <a href='{downloadUrl}' class='download-btn'>Download Invitation</a>
    </div>
</body>
</html>";

                // Send email
                await _emailService.SendEmailAsync(emailRequest.ToEmail, emailRequest.Subject, htmlBody);
                _logger.LogInformation("Invitation email sent successfully.");

                // Update the guest's invitation state to Sent using the GuestId
                if (emailRequest.GuestId.HasValue)
                {
                    await _guestAppService.UpdateInvitationState(emailRequest.GuestId.Value, "Sent");
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
                _logger.LogInformation(" EmailAccepted sent successfully.");
                return Ok(" EmailAccepted sent successfully.");
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
                _logger.LogInformation(" EmailRejected sent successfully.");
                return Ok(" EmailRejected sent successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending invitation email.");
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPost("SendEventTicket")]
        public async Task<IActionResult> SendEventTicket([FromBody] EmailRequest emailRequest)
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

                var htmlBody = EmailTicketTemplate.SendEventTicket(emailRequest.EventName, emailRequest.Date, emailRequest.EventAddress, guestName, emailRequest.EventImage);

                await _emailService.SendEmailAsync(emailRequest.ToEmail, emailRequest.Subject, htmlBody);
                _logger.LogInformation("Ticket sent successfully.");
                return Ok("Ticket sent successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending Ticket.");
                return StatusCode(500, "Internal server error");
            }
        }

        private async Task<IActionResult> DownloadInvitationPdfAsync(string eventName, DateTime date, string eventAddress, string eventImg)
        {
            try
            {
                // Assuming IConverter is injected into this controller
                var pdfController = new PdfController(_converter);
                return pdfController.DownloadInvitation(eventName, date, eventAddress, eventImg);
            }
            catch (Exception ex)
            {
               
                _logger.LogError(ex, "Error downloading PDF for invitation.");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}