using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Event_Planning_System.Enitities;

namespace Event_Planning_System.Entities
{
    [Table("GuestEvents")] 
    public class GuestEvent : IEntity<int>
    {
        [Key]
        public int Id { get; set; }
        public int GuestId { get; set; }
        public Guest Guest { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; }

        public bool IsTransient()
        {
            throw new NotImplementedException();
        }
    }
}
