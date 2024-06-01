using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Enitities;
using AutoMapper;

namespace Event_Planning_System.BudgetExpense.Dto.Mapping
{
    public class BudgetExpenseMappingProfile : Profile
    {
        public BudgetExpenseMappingProfile()
        {
            CreateMap<Enitities.BudgetExpense, BudgetExpenseDto>();
            CreateMap<BudgetExpenseDto, Enitities.BudgetExpense>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()); 
        }
    }

}
