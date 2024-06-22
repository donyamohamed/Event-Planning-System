using Event_Planning_System.Chats.DTO;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats
{
	public class ChatHub : Hub
	{
		private readonly IChatMessageAppService _chatMessageAppService;

		public ChatHub(IChatMessageAppService chatMessageAppService)
		{
			_chatMessageAppService = chatMessageAppService;
		}

		public async Task SendMessage(CreateChatMessageInput input)
		{
			await _chatMessageAppService.SendMessage(input);
			await Clients.All.SendAsync("ReceiveMessage", input);
		}
	}

}
