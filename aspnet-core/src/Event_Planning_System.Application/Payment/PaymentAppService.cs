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
using Abp.Domain.Repositories;
using Event_Planning_System.Entities;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Payment.Dto;
public class PaymentAppService : ApplicationService, IPaymentAppService
{
    private readonly StripeSettings _stripeSettings;
    private readonly ILogger<PaymentAppService> _logger;
    private readonly IRepository<Payment, int> _paymentRepository;
    private readonly IRepository<User, long> _userRepository;
    private readonly UserManager _userManager;
    private readonly IRepository<Event_Planning_System.Enitities.Event, int> _repositoryEvent;

    public PaymentAppService(
        IOptions<StripeSettings> stripeSettings,
        ILogger<PaymentAppService> logger,
        IRepository<Payment, int> paymentRepository,
        IRepository<Event_Planning_System.Enitities.Event, int> repositoryEvent,
        IRepository<User, long> userRepository,
        UserManager userManager)
    {
        _stripeSettings = stripeSettings.Value;
        _logger = logger;
        _paymentRepository = paymentRepository;
        _userRepository = userRepository;
        _userManager = userManager;
        _repositoryEvent = repositoryEvent;
        StripeConfiguration.ApiKey = "sk_test_51PcdCYAFPDLjCbDzmNaL6xyPq1hQLNTrNF6RapBsORBczDVcxnGeFyEjCxWjGO5SOKuSzIKUc8pUVKBSRF28LjTg002BalgpTa";
    }

    [HttpPost]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] PaymentDto paymentDto)
    {
        try
        {

            var userId = AbpSession.UserId.Value;
            if(userId != null)
            {
               paymentDto.GuestId=userId;

            }

            _logger.LogInformation("Starting CreateCheckoutSession with amount: {Amount}", paymentDto.Money);

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
                            UnitAmount = paymentDto.Money,
                        },
                        Quantity = paymentDto.NumberOfTickets,
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

          
            paymentDto.PaymentDate = DateTime.Now;
            var payment = ObjectMapper.Map<Payment>(paymentDto);
            //payment.StripeSessionId = session.Id;  

            await _paymentRepository.InsertAsync(payment);
            await CurrentUnitOfWork.SaveChangesAsync();

            return new OkObjectResult(new { sessionId = session.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating checkout session.");
            return new StatusCodeResult(500);
        }
    }
}
