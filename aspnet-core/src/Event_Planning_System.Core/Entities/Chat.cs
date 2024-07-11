using Abp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Entities
{
	public class ChatMessage : Entity<long>
	{
		public long SenderUserId { get; set; }
		public long ReceiverUserId { get; set; }
		public string Message { get; set; }
		public DateTime CreationTime { get; set; }

		public bool IsRead { get; set; }
	}
}
