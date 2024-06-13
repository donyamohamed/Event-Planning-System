using Abp.Application.Services;
using Event_Planning_System.BudgetExpense.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.BudgetExpense
{
    public interface IBudgetExpenseAppServices :IAsyncCrudAppService<BudgetExpenseDto,int>
    {
        Task<List<BudgetExpenseDto>> GetExpensesByUserAndEventAsync(int userId, int eventId);

    }
}
