using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Event_Planning_System.Enitities
{
    public class Interest
    {
		[Key]
		public int Id { get; set; }

		[Required(ErrorMessage = "Event type is required.")]
		public EventCategory Type { get; set; }

		public virtual ICollection<User> Users { get; set; } = new List<User>();

	}
}
