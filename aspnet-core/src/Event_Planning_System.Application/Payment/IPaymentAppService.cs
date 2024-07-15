using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Payment
{
    public interface IPaymentAppService: IAsyncCrudAppService<PaymentDto, int>
    {
        Task<IActionResult> CreateCheckoutSession([FromBody] PaymentDto paymentDto);
        Task<List<PaymentDto>> GetPaymentsByUserIdAsync(long userId);
        Task<List<PaymentDto>> GetPaymentsByEventIdAsync(int eventId);
        Task<decimal> GetTotalPaymentsForEvent(int eventId);
    }
}
