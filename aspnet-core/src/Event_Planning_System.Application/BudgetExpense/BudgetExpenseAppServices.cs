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
        public BudgetExpenseAppServices(IRepository<Enitities.BudgetExpense, int> repository) : base(repository)
        {
        }
    }

}
