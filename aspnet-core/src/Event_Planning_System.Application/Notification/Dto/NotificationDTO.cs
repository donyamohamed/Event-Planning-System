using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Notification.Dto
{
	
	namespace Event_Planning_System.Notification.Dto
	{

		public class NotificationDto
		{
			public int Id { get; set; }
			[Required(ErrorMessage = "Content is required.")]
			public string Content { get; set; }

			[Required(ErrorMessage = "Date is required.")]
			[DataType(DataType.DateTime, ErrorMessage = "Date must be a valid datetime.")]
			public DateTime Date { get; set; }

			[Required(ErrorMessage = "Notification type is required.")]
			public Notification_Type NType { get; set; }

			public bool isRead { get; set; }

			public Notification_Status status { get; set; }
			public long UserId { get; set; }

			public long GuestId { get; set; }


			public int EventId { get; set; }

		}
	}
}
