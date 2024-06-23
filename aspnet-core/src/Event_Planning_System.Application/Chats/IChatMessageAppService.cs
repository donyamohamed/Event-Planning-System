using Abp.Application.Services;
using Event_Planning_System.Chats.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats
{
	public interface IChatMessageAppService : IApplicationService
	{
		Task SendMessage(CreateChatMessageInput input);

		Task<List<ChatMessageDto>> GetMessages(long receiverUserId);

	}

}
