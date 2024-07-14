using Abp.Application.Services.Dto;
using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Payment.Dto
{
    public class PaymentDto : IEntityDto<int>
    {
        public int Id { get; set; }

        public long PlannerId { get; set; }

        public long GuestId { get; set; }

        public int EventId { get; set; }

        [Required(ErrorMessage = "Money Of Tickets is required.")]
        public int Money { get; set; }

        [Required(ErrorMessage = "Number Of Tickets are required.")]
        public int NumberOfTickets { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.Date)]
        public DateTime PaymentDate { get; set; }
    }
}
