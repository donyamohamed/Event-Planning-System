using Abp.Domain.Entities;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Entities
{
    public class Payment : IEntity<int>
    {
        public int Id { get ; set; }

        public long PlannerId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        public long GuestId { get; set; }

        [ForeignKey("GuestId")]
        public virtual User Guest { get; set; }

        public int EventId { get; set; }

        [ForeignKey("EventId")]
        public virtual Event Event { get; set; }
        [Required(ErrorMessage = "Money Of Tickets is required.")]
        public int  Money { get; set; }

        [Required(ErrorMessage = "Number Of Tickets are required.")]
        public int NumberOfTickets {  get; set; }

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.Date)]
        public DateTime PaymentDate { get; set; }

        public bool IsTransient()
        {
            throw new NotImplementedException();
        }
    }
}
