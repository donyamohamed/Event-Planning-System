using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Enitities;

namespace Event_Planning_System.Entities
{
    public class GuestEvent
    {
        public int GuestId { get; set; }
        public Guest Guest { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; }
    }
}
