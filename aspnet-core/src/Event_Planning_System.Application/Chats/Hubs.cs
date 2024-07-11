using Abp.Dependency;
using Abp.Domain.Uow;
using Abp.RealTime;
using Abp.Runtime.Session;
using Castle.Core.Logging;
using Event_Planning_System.Chats.DTO;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats
{
    public class ChatHub : Hub, ITransientDependency
    {
        private readonly IOnlineClientManager _onlineClientManager;
        private readonly IChatMessageAppService _chatMessageAppService;
        private readonly IChatUserConnectionRepository _userConnectionRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;
        public IAbpSession AbpSession { get; set; }
        public ILogger Logger { get; set; }

        public ChatHub(
            IOnlineClientManager onlineClientManager,
            IAbpSession abpSession,
            IChatMessageAppService chatMessageAppService,
            IChatUserConnectionRepository userConnectionRepository,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _onlineClientManager = onlineClientManager;
            _chatMessageAppService = chatMessageAppService;
            _userConnectionRepository = userConnectionRepository;
            _unitOfWorkManager = unitOfWorkManager;
            AbpSession = abpSession ?? NullAbpSession.Instance;
            Logger = NullLogger.Instance;
        }

        public async Task SendMessage(CreateChatMessageInput input)
        {
            try
            {
                var userId = AbpSession.UserId;
                if (userId == null)
                {
                    throw new Exception("User is not authenticated.");
                }

                // Store message using the application service
                await _chatMessageAppService.SendMessage(input);

                // Notify receiver
                var chatMessageDto = new ChatMessageDto
                {
                    SenderUserId = input.SenderUserId,
                    ReceiverUserId = input.ReceiverUserId,
                    Message = input.Message,
                    CreationTime = Abp.Timing.Clock.Now
                };

                // Get connection IDs for sender and receiver
                var senderConnections = await _userConnectionRepository.GetConnectionIdsByUserIdAsync(input.SenderUserId);
                var receiverConnections = await _userConnectionRepository.GetConnectionIdsByUserIdAsync(input.ReceiverUserId);

                // Send message to all connections of sender and receiver
                var allConnections = senderConnections.Concat(receiverConnections).Distinct().ToList();
                await Clients.Clients(allConnections).SendAsync("ReceiveMessage", chatMessageDto);
            }
            catch (Exception ex)
            {
                Logger.Error("Exception in SendMessage: ", ex);
                throw;
            }
        }

        public override async Task OnConnectedAsync()
        {
            var userId = AbpSession.UserId?.ToString();
            var connectionId = Context.ConnectionId;

            // Add or update user's connection in repository within a unit of work
            using (var unitOfWork = _unitOfWorkManager.Begin())
            {
                try
                {
                    await _userConnectionRepository.AddOrUpdateUserConnectionAsync(userId, connectionId);
                    await unitOfWork.CompleteAsync();
                }
                catch (Exception ex)
                {
                    Logger.Error("Exception in OnConnectedAsync: ", ex);
                    throw;
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = AbpSession.UserId?.ToString();
            var connectionId = Context.ConnectionId;

            // Remove user's connection from repository within a unit of work
            using (var unitOfWork = _unitOfWorkManager.Begin())
            {
                try
                {
                    await _userConnectionRepository.RemoveUserConnectionAsync(userId, connectionId);
                    await unitOfWork.CompleteAsync();
                }
                catch (Exception ex)
                {
                    Logger.Error("Exception in OnDisconnectedAsync: ", ex);
                    throw;
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}
