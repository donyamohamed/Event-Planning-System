using Abp.Domain.Entities;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Entities
{
    public class Payment : Entity<int>
    {
        public int Id { get ; set; }

        public long UserId { get; set; }

        [ForeignKey("UserId")]
        [DeleteBehavior(DeleteBehavior.NoAction)]
        public virtual User User { get; set; }

        public long GuestId { get; set; }

        [ForeignKey("GuestId")]
        [DeleteBehavior(DeleteBehavior.NoAction)]
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
        //public string StripeSessionId { get; set; }

        public bool IsTransient()
        {
            throw new NotImplementedException();
        }
    }
}
