using Event_Planning_System.Payment;
using Event_Planning_System.Payment.Dto;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentAppService _paymentAppService;

        public PaymentController(IPaymentAppService paymentAppService)
        {
            _paymentAppService = paymentAppService;
        }

        //[HttpPost("CreateCheckoutSession")]
        //public async Task<IActionResult> CreateCheckoutSession([FromBody] PaymentDto paymentDto, [FromQuery] int eventId)
        //{
        //    return await _paymentAppService.CreateCheckoutSession(paymentDto, eventId);
        //}
    }
}
