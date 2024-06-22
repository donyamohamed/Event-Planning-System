using Event_Planning_System.Chats.DTO;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats
{
    public class ChatHub : Hub
    {
        private readonly IChatMessageAppService _chatMessageAppService;
        private static ConcurrentDictionary<long, string> _userConnections = new ConcurrentDictionary<long, string>();

        public ChatHub(IChatMessageAppService chatMessageAppService)
        {
            _chatMessageAppService = chatMessageAppService;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier; // This is set by the CustomUserIdProvider
            if (userId != null)
            {
                _userConnections[long.Parse(userId)] = Context.ConnectionId;
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            var userId = Context.UserIdentifier;
            if (userId != null)
            {
                _userConnections.TryRemove(long.Parse(userId), out _);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateChatMessageInput input)
        {
            await _chatMessageAppService.SendMessage(input);

            // Send message to the specific receiver
            if (_userConnections.TryGetValue(input.ReceiverUserId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", input);
            }
        }

        public async Task<List<ChatMessageDto>> GetMessages(long userId)
        {
            return await _chatMessageAppService.GetMessages(userId);
        }
    }
}
