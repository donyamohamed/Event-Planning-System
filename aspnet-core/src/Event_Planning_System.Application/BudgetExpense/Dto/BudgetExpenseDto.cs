using Abp.Application.Services.Dto;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.BudgetExpense.Dto
{
    [AutoMap(typeof(Enitities.BudgetExpense))]
    public class BudgetExpenseDto : IEntityDto<int>
    {
        public int Id { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Amount must be a non-negative integer.")]
        public int Amount { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        public long UserId { get; set; }
        public bool IsTransient()
        {
            throw new NotImplementedException();
        }

    }
}
