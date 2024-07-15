using Event_Planning_System.Payment;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentAppService _paymentAppService;

        public PaymentController(IPaymentAppService paymentAppService)
        {
            _paymentAppService = paymentAppService;
        }
        [HttpPost]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] string amount)
        {
            return await _paymentAppService.CreateCheckoutSession(amount);
        }
    }
}
