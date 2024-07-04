using Abp.Domain.Entities;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Entities
{
    public class FavoriteEvent : IEntity<int>
    {
        public int Id { get; set; }
        public long UserId { get; set; }
        public User User { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; }

        public bool IsTransient()
        {
            return Id == default(int);
        }
    }
}
