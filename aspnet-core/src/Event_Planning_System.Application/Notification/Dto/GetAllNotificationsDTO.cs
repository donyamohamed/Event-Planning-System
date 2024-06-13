using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Notification.Dto
{
	public class GetAllNotificationsDTO
	{
		public int Id { get; set; }
		public string Content { get; set; }
		public DateTime Date { get; set; }
		public Notification_Type NType { get; set; }
		public bool isRead { get; set; }
		public Notification_Status status { get; set; }
	}
}
