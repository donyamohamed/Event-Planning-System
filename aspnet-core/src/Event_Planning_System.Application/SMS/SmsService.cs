using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using Vonage;
using Vonage.Request;
using Vonage.Messaging;

namespace Event_Planning_System.SMS
{
    public class SmsService : Event_Planning_SystemAppServiceBase, ISmsService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SmsService> _logger;
        private readonly VonageClient _vonageClient;

        public SmsService(IConfiguration configuration, ILogger<SmsService> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            var apiKey = _configuration["Nexmo:ApiKey"];
            var apiSecret = _configuration["Nexmo:ApiSecret"];
            var fromPhoneNumber = _configuration["Nexmo:FromPhoneNumber"];

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret) || string.IsNullOrEmpty(fromPhoneNumber))
            {
                throw new InvalidOperationException("Nexmo configuration is not properly set.");
            }

            var credentials = Credentials.FromApiKeyAndSecret(apiKey, apiSecret);
            _vonageClient = new VonageClient(credentials);
        }

        public async Task SendSmsAsync(SmsRequest smsRequest)
        {
            if (string.IsNullOrEmpty(smsRequest.ToPhoneNumber))
            {
                _logger.LogError("Phone number cannot be null or empty.");
                throw new ArgumentException("Phone number cannot be null or empty.", nameof(smsRequest.ToPhoneNumber));
            }

            if (string.IsNullOrEmpty(smsRequest.Message))
            {
                _logger.LogError("Message cannot be null or empty.");
                throw new ArgumentException("Message cannot be null or empty.", nameof(smsRequest.Message));
            }

            try
            {
                var fromPhoneNumber = _configuration["Nexmo:FromPhoneNumber"];
                var response = await _vonageClient.SmsClient.SendAnSmsAsync(new SendSmsRequest
                {
                    To = smsRequest.ToPhoneNumber,
                    From = fromPhoneNumber,
                    Text = $"{smsRequest.Message}\nEvent: {smsRequest.EventName}\nDate: {smsRequest.Date}\nAddress: {smsRequest.EventAddress}"
                });

                if (response.Messages[0].Status != "0")
                {
                    _logger.LogError($"Failed to send SMS. Error: {response.Messages[0].ErrorText}");
                }
                else
                {
                    _logger.LogInformation("SMS sent successfully to {ToPhoneNumber}.", smsRequest.ToPhoneNumber);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending SMS to {ToPhoneNumber}.", smsRequest.ToPhoneNumber);
                throw; // rethrow the exception after logging it
            }
        }
    }
}
