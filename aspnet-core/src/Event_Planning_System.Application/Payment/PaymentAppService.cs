//using Event_Planning_System.Payment;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Logging;
//using Stripe.Checkout;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using System;
//using Microsoft.Extensions.Options;
//using Abp.Application.Services;

//public class PaymentAppService : ApplicationService , IPaymentAppService
//{
//    private readonly StripeSettings _stripeSettings;
//    private readonly ILogger<PaymentAppService> _logger;

//    public PaymentAppService(IOptions<StripeSettings> stripeSettings, ILogger<PaymentAppService> logger)
//    {
//        _stripeSettings = stripeSettings.Value;
//        _logger = logger;
//    }
//    [HttpPost]
//    public async Task<IActionResult> CreateCheckoutSession(string amount)
//    {
//        try
//        {
//            _logger.LogInformation("Starting CreateCheckoutSession with amount: {Amount}", amount);

//            var options = new SessionCreateOptions
//            {
//                PaymentMethodTypes = new List<string> { "card" },
//                LineItems = new List<SessionLineItemOptions>
//                {
//                    new SessionLineItemOptions
//                    {
//                        PriceData = new SessionLineItemPriceDataOptions
//                        {
//                            Currency = "gbp",
//                            ProductData = new SessionLineItemPriceDataProductDataOptions
//                            {
//                                Name = "Event Ticket",
//                            },
//                            UnitAmount = int.Parse(amount),
//                        },
//                        Quantity = 1,
//                    },
//                },
//                Mode = "payment",
//                SuccessUrl = "http://localhost:4200/success",
//                CancelUrl = "http://localhost:4200/cancel",
//            };

//            var service = new SessionService();
//            Session session = await service.CreateAsync(options);

//            _logger.LogInformation("Checkout session created successfully with ID: {SessionId}", session.Id);
//            _logger.LogInformation("Checkout session details: {@Session}", session);
//            return new OkObjectResult(new { sessionId = session.Id });
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "Error occurred while creating checkout session.");
//            return new StatusCodeResult(500);
//        }
//    }
//}
using Event_Planning_System.Payment;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe.Checkout;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Options;
using Abp.Application.Services;
using Stripe;

public class PaymentAppService : ApplicationService, IPaymentAppService
{
    private readonly StripeSettings _stripeSettings;
    private readonly ILogger<PaymentAppService> _logger;

    public PaymentAppService(IOptions<StripeSettings> stripeSettings, ILogger<PaymentAppService> logger)
    {
        _stripeSettings = stripeSettings.Value;
        _logger = logger;
        StripeConfiguration.ApiKey = "sk_test_51PcdCYAFPDLjCbDzmNaL6xyPq1hQLNTrNF6RapBsORBczDVcxnGeFyEjCxWjGO5SOKuSzIKUc8pUVKBSRF28LjTg002BalgpTa"; // Use the Stripe API key from settings
    }

    [HttpPost]
    public async Task<IActionResult> CreateCheckoutSession(string amount)
    {
        try
        {
            _logger.LogInformation("Starting CreateCheckoutSession with amount: {Amount}", amount);

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "gbp",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Event Ticket",
                            },
                            UnitAmount = int.Parse(amount),
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                SuccessUrl = "http://localhost:4200/success",
                CancelUrl = "http://localhost:4200/cancel",
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            _logger.LogInformation("Checkout session created successfully with ID: {SessionId}", session.Id);
            _logger.LogInformation("Checkout session details: {@Session}", session);
            return new OkObjectResult(new { sessionId = session.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating checkout session.");
            return new StatusCodeResult(500);
        }
    }
}