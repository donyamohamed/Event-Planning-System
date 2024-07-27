using Abp.Application.Services;
using Abp.Domain.Repositories;
using Event_Planning_System.Entities;
using Event_Planning_System.Payment.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Payment;
using Event_Planning_System.Email;
using Event_Planning_System.Enitities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

public class PaymentAppService : AsyncCrudAppService<Payment, PaymentDto, int>, IPaymentAppService
{
    private readonly StripeSettings _stripeSettings;
    private readonly ILogger<PaymentAppService> _logger;
    private readonly IRepository<Payment, int> _paymentRepository;
    private readonly IRepository<User, long> _userRepository;
    private readonly UserManager _userManager;
    private readonly IConfiguration _configuration;
    private readonly IRepository<Event_Planning_System.Enitities.Event, int> _eventRepository;
    private readonly IEmailService _emailService;
    private readonly IRepository<Event_Planning_System.Enitities.Guest, int> _guestRepository;
    public PaymentAppService(
        IOptions<StripeSettings> stripeSettings,
        ILogger<PaymentAppService> logger,
        IRepository<Payment, int> paymentRepository,
        IRepository<User, long> userRepository,
        IConfiguration configuration,
        IRepository<Event_Planning_System.Enitities.Event, int> eventRepository,
        IRepository<Event_Planning_System.Enitities.Guest, int> guestRepository,
        UserManager userManager, IEmailService emailService)
        : base(paymentRepository)
    {
        _stripeSettings = stripeSettings.Value;
        _logger = logger;
        _paymentRepository = paymentRepository;
        _userRepository = userRepository;
        _userManager = userManager;
        _eventRepository = eventRepository;
        _configuration = configuration;
        _emailService = emailService;
        _guestRepository=guestRepository;
        StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
    }

    //[HttpPost]
    //public async Task<IActionResult> CreateCheckoutSession([FromBody] PaymentDto paymentDto)
    //{
    //    try
    //    {
    //        var userId = AbpSession.UserId;
    //        if (userId.HasValue)
    //        {
    //            paymentDto.UserId = userId.Value;
    //        }

    //        _logger.LogInformation("Starting CreateCheckoutSession with amount: {Amount}", paymentDto.Money);

    //        var options = new SessionCreateOptions
    //        {
    //            PaymentMethodTypes = new List<string> { "card" },
    //            LineItems = new List<SessionLineItemOptions>
    //            {
    //                new SessionLineItemOptions
    //                {
    //                    PriceData = new SessionLineItemPriceDataOptions
    //                    {
    //                        Currency = "egp",
    //                        ProductData = new SessionLineItemPriceDataProductDataOptions
    //                        {
    //                            Name = "Event Ticket",
    //                        },
    //                        UnitAmount = (long)(paymentDto.Money * 100),
    //                    },
    //                    Quantity = paymentDto.NumberOfTickets,
    //                },
    //            },
    //            Mode = "payment",
    //            SuccessUrl = $"http://localhost:4200/app/payment-success?session_id={{CHECKOUT_SESSION_ID}}&eventId={paymentDto.EventId}&guestId={paymentDto.GuestId}&numberOfTickets={paymentDto.NumberOfTickets}",

    //            CancelUrl = "http://localhost:4200/app/payment-failed",
    //        };

    //        var service = new SessionService();
    //        Session session = await service.CreateAsync(options);




    //        _logger.LogInformation("Checkout session created successfully with ID: {SessionId}", session.Id);

    //        paymentDto.PaymentDate = DateTime.Now;
    //        var payment = ObjectMapper.Map<Payment>(paymentDto);
    //        //payment.StripeSessionId = session.Id;

    //        await _paymentRepository.InsertAsync(payment);
    //        await CurrentUnitOfWork.SaveChangesAsync();




    //        var eventEntity = await _eventRepository.FirstOrDefaultAsync(e => e.Id == paymentDto.EventId);
    //        //if (eventEntity == null)
    //        //{
    //        //    throw new Exception("Event not found");
    //        //}

    //        //if (eventEntity.NumberOfTickets < paymentDto.NumberOfTickets)
    //        //{
    //        //    throw new Exception("Not enough tickets available");
    //        //}

    //        //eventEntity.NumberOfTickets -= paymentDto.NumberOfTickets;
    //        //await _eventRepository.UpdateAsync(eventEntity);

    //        //var guest = await _userRepository.FirstOrDefaultAsync(u => u.Id == paymentDto.GuestId);
    //        //if (guest != null)
    //        //{
    //        //    var htmlBody = EmailTicketTemplate.SendEventTicket(eventEntity.Name, eventEntity.StartDate, eventEntity.Location, guest.Name, eventEntity.EventImg);
    //        //    await _emailService.SendEmailAsync(guest.EmailAddress, "Event Ticket", htmlBody);
    //        //}
    //        await SendEventTicketEmail(paymentDto);
    //        return new OkObjectResult(new { sessionId = session.Id });
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error occurred while creating checkout session.");
    //        return new StatusCodeResult(500);
    //    }
    //}

    [HttpPost]
    public async Task<IActionResult> CreateCheckoutSession([FromBody] PaymentDto paymentDto)
    {
        try
        {
            var userId = AbpSession.UserId;
            if (!userId.HasValue)
            {
                throw new Exception("User not authenticated.");
            }

            _logger.LogInformation("Starting CreateCheckoutSession with amount: {Amount}", paymentDto.Money);

            using (var uow = UnitOfWorkManager.Begin())
            {
                var options = new SessionCreateOptions
                {
                    PaymentMethodTypes = new List<string> { "card" },
                    LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "egp",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = "Event Ticket",
                            },
                            UnitAmount = (long)(paymentDto.Money * 100),
                        },
                        Quantity = paymentDto.NumberOfTickets,
                    },
                },
                    Mode = "payment",
                    SuccessUrl = $"http://localhost:4200/app/payment-success?session_id={{CHECKOUT_SESSION_ID}}&eventId={paymentDto.EventId}&guestId={paymentDto.GuestId}&numberOfTickets={paymentDto.NumberOfTickets}",
                    CancelUrl = "http://localhost:4200/app/payment-failed",
                };

                var service = new SessionService();
                Session session = await service.CreateAsync(options);

                _logger.LogInformation("Checkout session created successfully with ID: {SessionId}", session.Id);

                // Create payment entity
                paymentDto.PaymentDate = DateTime.Now;
                var payment = ObjectMapper.Map<Payment>(paymentDto);
                await _paymentRepository.InsertAsync(payment);

                // Update event tickets
                var eventEntity = await _eventRepository.FirstOrDefaultAsync(e => e.Id == paymentDto.EventId);
                if (eventEntity == null)
                {
                    throw new Exception("Event not found");
                }

                if (eventEntity.NumberOfTickets < paymentDto.NumberOfTickets)
                {
                    throw new Exception("Not enough tickets available");
                }

                eventEntity.NumberOfTickets -= paymentDto.NumberOfTickets;
                await _eventRepository.UpdateAsync(eventEntity);

             

                await uow.CompleteAsync(); // Commit transaction
                return new OkObjectResult(new { sessionId = session.Id });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating checkout session.");
            return new StatusCodeResult(500);
        }
    }




    private async Task SendEventTicketEmail(PaymentDto paymentDto)
    {
        var eventEntity = await _eventRepository.FirstOrDefaultAsync(e => e.Id == paymentDto.EventId);
        var guest = await _userRepository.FirstOrDefaultAsync(u => u.Id == paymentDto.GuestId);

        if (eventEntity != null && guest != null)
        {
            var htmlBody = EmailTicketTemplate.SendEventTicket(eventEntity.Name, eventEntity.StartDate, eventEntity.Location, guest.Name, eventEntity.EventImg);
            await _emailService.SendEmailAsync(guest.EmailAddress, "Event Ticket", htmlBody);
        }
        else
        {
            throw new Exception("Event or guest not found.");
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







