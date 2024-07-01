using Event_Planning_System.Chats.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats
{
    public interface IChatMessageAppService
    {
        Task SendMessage(CreateChatMessageInput input);
        Task<List<ChatMessageDto>> GetMessages(long userId, long receiverId);
        Task<List<UserChatDTO>> GetAllUserChats();
        Task<ChatMessageDto> GetTheLastMsg(int receiverId);
    }
}
