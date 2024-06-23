using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats.DTO
{
	public class CreateChatMessageInput
	{
		public long SenderUserId { get; set; }
		public long ReceiverUserId { get; set; }
		public string Message { get; set; }
	}

}
