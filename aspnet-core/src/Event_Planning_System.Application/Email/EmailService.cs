using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace Event_Planning_System.Email
{
    public class EmailService : Event_Planning_SystemAppServiceBase, IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var smtpSettings = new SmtpSettings
            {
                Host = _configuration["Smtp:Host"],
                Port = int.Parse(_configuration["Smtp:Port"]),
                EnableSsl = bool.Parse(_configuration["Smtp:EnableSsl"]),
                UserName = _configuration["Smtp:UserName"],
                Password = _configuration["Smtp:Password"],
                DefaultFromAddress = _configuration["Smtp:DefaultFromAddress"],
                DefaultFromDisplayName = _configuration["Smtp:DefaultFromDisplayName"]
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSettings.DefaultFromAddress, smtpSettings.DefaultFromDisplayName),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            try
            {
                using (var client = new SmtpClient(smtpSettings.Host, smtpSettings.Port))
                {
                    client.Credentials = new NetworkCredential(smtpSettings.UserName, smtpSettings.Password);
                    client.EnableSsl = smtpSettings.EnableSsl;
                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to send email to {toEmail}: {ex.Message}");
                throw;
            }
        }
    }

    public class SmtpSettings
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool EnableSsl { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string DefaultFromAddress { get; set; }
        public string DefaultFromDisplayName { get; set; }
    }
}
