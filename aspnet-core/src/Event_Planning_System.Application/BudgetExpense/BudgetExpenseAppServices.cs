using Abp.Application.Services;
using Abp.Domain.Repositories;
using Event_Planning_System.BudgetExpense.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.BudgetExpense
{
    public class BudgetExpenseAppServices : AsyncCrudAppService<Enitities.BudgetExpense, BudgetExpenseDto, int>, IBudgetExpenseAppServices
    {
        private readonly IRepository<Enitities.Event,int> _eventRepository;
        public BudgetExpenseAppServices(IRepository<Enitities.BudgetExpense, int> repository, IRepository<Enitities.Event, int> eventRepository) : base(repository)
        {
            _eventRepository = eventRepository;
        }
        public async Task<List<BudgetExpenseDto>> GetExpensesByUserAndEventAsync(int userId, int eventId)
        {
            var expenses = await Repository.GetAllListAsync(e => e.UserId == userId && e.EventId == eventId);
            return ObjectMapper.Map<List<BudgetExpenseDto>>(expenses);
        }
        public async Task<Dictionary<string, List<BudgetExpenseDto>>> GetExpenseForAllEventAsync()
        {
            Dictionary<string, List<BudgetExpenseDto>> budgetEvents = new Dictionary<string, List<BudgetExpenseDto>>();
            var userId = AbpSession.UserId;

            if (userId == null)
            {
                throw new UnauthorizedAccessException("User is not logged in.");
            }

            var userEvents = _eventRepository.GetAll().Where(a => a.UserId == userId && a.EndDate < DateTime.Now).ToList();

            if (!userEvents.Any())
            {
                return budgetEvents; // Return empty dictionary if no events found
            }

            foreach (var eventUser in userEvents)
            {
                var expenses = await GetExpensesByUserAndEventAsync((int)userId, eventUser.Id);
                if (expenses != null)
                {
                    budgetEvents.Add(eventUser.Name, expenses);
                }
                else
                {
                    budgetEvents.Add(eventUser.Name, new List<BudgetExpenseDto>());
                }
            }

            return budgetEvents;
        }

    }

}
