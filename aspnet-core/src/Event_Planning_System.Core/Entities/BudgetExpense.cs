using Abp.Domain.Entities.Auditing;
using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Enitities
{
    public class BudgetExpense 
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
		[ForeignKey("UserId")]
		public virtual User User { get; set; }
    }
}
