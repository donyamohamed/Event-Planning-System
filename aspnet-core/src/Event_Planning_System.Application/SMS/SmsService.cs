using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Vonage;
using Vonage.Request;
using Vonage.Messaging;
using System.Net;
using System;

namespace Event_Planning_System.SMS
{
    public class SmsService : Event_Planning_SystemAppServiceBase, ISmsService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SmsService> _logger;
        private readonly VonageClient _vonageClient;

        public SmsService(IConfiguration configuration, ILogger<SmsService> logger)
        {
            _configuration = configuration;
            _logger = logger;

            var credentials = Credentials.FromApiKeyAndSecret(
                _configuration["Nexmo:ApiKey"],
                _configuration["Nexmo:ApiSecret"]
            );
            _vonageClient = new VonageClient(credentials);
        }

        public async Task SendSmsAsync(string toPhoneNumber, string message)
        {
            try
            {
                var fromPhoneNumber = _configuration["Nexmo:FromPhoneNumber"];
                var response = await _vonageClient.SmsClient.SendAnSmsAsync(new SendSmsRequest
                {
                    To = toPhoneNumber,
                    From = fromPhoneNumber,
                    Text = message
                });

                if (response.Messages[0].Status != "0")
                {
                    _logger.LogError($"Failed to send SMS. Error: {response.Messages[0].ErrorText}");
                }
                else
                {
                    _logger.LogInformation("SMS sent successfully.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending SMS.");
            }
        }
    }
}
