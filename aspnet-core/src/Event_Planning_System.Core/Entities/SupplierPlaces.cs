
using Abp.Domain.Entities;
using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Entities
{
	public class SupplierPlaces : Entity<int>
	{
		public EventCategory eventCategory { get; set; }
		public decimal Price { get; set; }//
		public string Name { get; set; }//
		public string Location { get; set; }
		public int Capacity { get; set; }//
		public string Image { get; set; }//
		public string ContactEmail { get; set; }//
		public string Description { get; set; }
		public long UserId { get; set; }
		[ForeignKey("UserId")]
		public virtual User User { get; set; }
	}
}
