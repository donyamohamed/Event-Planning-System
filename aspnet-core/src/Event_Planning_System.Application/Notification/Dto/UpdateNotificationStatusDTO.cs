using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Notification.Dto
{
	public class UpdateNotificationStatusDTO
	{
		public int Id { get; set; }
		public Notification_Status status { get; set; }
		//public string content { get;set;}
	}
}
