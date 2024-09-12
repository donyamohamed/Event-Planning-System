using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Email
{
    public class EmailRequest
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string EventName { get; set; }
        public DateTime Date { get; set; }
        public string EventAddress { get; set; }
        public string EventImage { get; set; }
        public int? GuestId { get; set; }
        public int? EventId { get; set; }

    }
}
