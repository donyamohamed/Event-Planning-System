using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Event.Dto
{
	public class UpdateEventStatusDto
	{
		public int Id { get; set; }
		public bool isRead { get; set; } = false;
	}
}
