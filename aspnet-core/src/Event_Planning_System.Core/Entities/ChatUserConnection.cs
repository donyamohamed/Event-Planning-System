using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Entities
{
    public class ChatUserConnection : Entity<long>
    {
       
        public string UserId { get; set; }
        public string ConnectionId { get; set; }
    }
}
