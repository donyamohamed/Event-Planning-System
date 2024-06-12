using Abp.Domain.Entities;
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
    public class BudgetExpense : IEntity<int>
    {
        public int Id { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Amount must be a non-negative integer.")]
        public int Amount { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }


    

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        public long UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public bool IsTransient()
        {
            throw new NotImplementedException();
        }
        public int EventId { get; set; }
        [ForeignKey("EventId")]
        public virtual Event Event { get; set; }
    }
}