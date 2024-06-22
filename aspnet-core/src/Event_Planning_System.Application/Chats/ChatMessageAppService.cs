using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Timing;
using Event_Planning_System.Chats.DTO;
using Event_Planning_System.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats
{
    public class ChatMessageAppService : ApplicationService, IChatMessageAppService
    {
        private readonly IRepository<ChatMessage, long> _chatMessageRepository;

        public ChatMessageAppService(IRepository<ChatMessage, long> chatMessageRepository)
        {
            _chatMessageRepository = chatMessageRepository;
        }

        public async Task SendMessage(CreateChatMessageInput input)
        {
            var chatMessage = new ChatMessage
            {
                SenderUserId = input.SenderUserId,
                ReceiverUserId = input.ReceiverUserId,
                Message = input.Message,
                CreationTime = Clock.Now
            };
            await _chatMessageRepository.InsertAsync(chatMessage);
        }

        public async Task<List<ChatMessageDto>> GetMessages(long userId)
        {
            var messages = await _chatMessageRepository
                .GetAllListAsync(m => m.ReceiverUserId == userId || m.SenderUserId == userId);

            return messages.Select(m => new ChatMessageDto
            {
                SenderUserId = m.SenderUserId,
                ReceiverUserId = m.ReceiverUserId,
                Message = m.Message,
                CreationTime = m.CreationTime
            }).ToList();
        }
    }
}
