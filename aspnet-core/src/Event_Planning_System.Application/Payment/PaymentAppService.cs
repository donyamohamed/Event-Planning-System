using Abp.Application.Services;
using Abp.Domain.Repositories;
using Event_Planning_System.Entities; 
using Event_Planning_System.Payment.Dto;
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
public class PaymentAppService : AsyncCrudAppService<Payment, PaymentDto, int>, IPaymentAppService
{
    private readonly StripeSettings _stripeSettings;
    private readonly ILogger<PaymentAppService> _logger;
    private readonly IRepository<Payment, int> _paymentRepository;
    private readonly IRepository<User, long> _userRepository;
    private readonly UserManager _userManager;

    public PaymentAppService(
        IOptions<StripeSettings> stripeSettings,
        ILogger<PaymentAppService> logger,
        IRepository<Payment, int> paymentRepository,
        IRepository<User, long> userRepository,
        UserManager userManager)
         : base(paymentRepository)
    {
        _stripeSettings = stripeSettings.Value;
        _logger = logger;
        _paymentRepository = paymentRepository;
        _userRepository = userRepository;
        _userManager = userManager;
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


  

    public async Task<decimal> GetTotalPaymentsForEvent(int eventId)
    {
        var payments = await _paymentRepository.GetAllListAsync(p => p.EventId == eventId);
        decimal totalAmount = 0;
        foreach (var payment in payments)
        {
            totalAmount += payment.Money;
        }
        return totalAmount;
    }




    public async Task<List<PaymentDto>> GetPaymentsByUserIdAsync(long userId)
    {
        var payments = await _paymentRepository.GetAllListAsync(p => p.UserId == userId);
        return ObjectMapper.Map<List<PaymentDto>>(payments);
    }

    public async Task<List<PaymentDto>> GetPaymentsByEventIdAsync(int eventId)
    {
        var payments = await _paymentRepository.GetAllListAsync(p => p.EventId == eventId);
        return ObjectMapper.Map<List<PaymentDto>>(payments);
    }


}
