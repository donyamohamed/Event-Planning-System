using Abp.Application.Services;
using Abp.Domain.Repositories;
using Event_Planning_System.Entities; 
using Event_Planning_System.Payment.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Event_Planning_System.Payment
{
    public class PaymentAppService : AsyncCrudAppService<Entities.Payment, PaymentDto, int>, IPaymentAppService
    {
        public PaymentAppService(IRepository<Entities.Payment, int> repository) : base(repository)
        {
        }

        public async Task<List<PaymentDto>> GetPaymentsByUserIdAsync(long userId)
        {
            var payments = await Repository.GetAllListAsync(p => p.UserId == userId);
            return ObjectMapper.Map<List<PaymentDto>>(payments);
        }

        public async Task<List<PaymentDto>> GetPaymentsByEventIdAsync(int eventId)
        {
            var payments = await Repository.GetAllListAsync(p => p.EventId == eventId);
            return ObjectMapper.Map<List<PaymentDto>>(payments);
        }

        public async Task<decimal> GetTotalPaymentsForEvent(int eventId)
        {
            var payments = await Repository.GetAllListAsync(p => p.EventId == eventId);
            decimal totalAmount = 0;
            foreach (var payment in payments)
            {
                totalAmount += payment.Money;
            }
            return totalAmount;
        }
    }
}
