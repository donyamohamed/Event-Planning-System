using Abp.Domain.Repositories;
using Event_Planning_System.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Event_Planning_System.AllGuest
{
    public class AllGuestService : IAllGuestService
    {
        //private readonly Event_Planning_SystemDbContext _context;
        private readonly IRepository<Entities.GuestEvent, int> _guesteventrepository;
        private readonly IRepository<Entities.Payment, int> _paymentrepository;
        private readonly ILogger<AllGuestService> _logger;

        public AllGuestService(
            //Event_Planning_SystemDbContext context,
            IRepository<Entities.GuestEvent, int> guesteventrepository,
            IRepository<Entities.Payment, int> paymentrepository,
            ILogger<AllGuestService> logger)
        {
            //_context = context;
            _guesteventrepository = guesteventrepository;
            _paymentrepository = paymentrepository;
            _logger = logger;
        }

        public async Task<int> GetGuestCountByEventId(int eventId)
        {
            _logger.LogInformation($"Getting guest count for event ID: {eventId}");
            try
            {
                var guestEventCount = await _guesteventrepository.GetAll()
                    .Where(ge => ge.EventId == eventId)
                    .CountAsync();

                var paymentGuestCount = await _paymentrepository.GetAll()
                    .Where(p => p.EventId == eventId)
                    .SumAsync(p => p.NumberOfTickets);

                var totalGuestCount = guestEventCount + paymentGuestCount;
                _logger.LogInformation($"Total guest count: {totalGuestCount}");

                return totalGuestCount;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while getting guest count for event ID: {eventId}");
                throw; // Rethrow the exception to propagate it up
            }
        }
    }
}
