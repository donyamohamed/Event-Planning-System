using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Domain.Uow;
using Abp.Timing;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Chats.DTO;
using Event_Planning_System.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats
{
    public class ChatMessageAppService : ApplicationService, IChatMessageAppService
    {
        private readonly IRepository<ChatMessage, long> _chatMessageRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public ChatMessageAppService(IUnitOfWorkManager unitOfWorkManager, IRepository<ChatMessage, long> chatMessageRepository, IRepository<User, long> userRepository)
        {

            _unitOfWorkManager = unitOfWorkManager;
            _chatMessageRepository = chatMessageRepository;
            _userRepository = userRepository;
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

            using (var unitOfWork = _unitOfWorkManager.Begin())
            {
                try
                {
                    await _chatMessageRepository.InsertAsync(chatMessage);
                    await _unitOfWorkManager.Current.SaveChangesAsync(); // Save changes manually if necessary

                    // Notify receiver or perform any other post-insert operations here

                    await unitOfWork.CompleteAsync(); // Commit the unit of work
                    Console.WriteLine("ChatMessage inserted successfully.");
                }
                catch (Exception ex)
                {
                    // Handle or log the exception
                    Console.WriteLine($"Exception while inserting chat message: {ex}");
                    Console.WriteLine($"SenderUserId: {input.SenderUserId}, ReceiverUserId: {input.ReceiverUserId}, Message: {input.Message}");

                    // Optionally rethrow the exception
                    throw;
                }
            }
        }
        public async Task<List<ChatMessageDto>> GetMessages(long userId, long receiverId)
        {
            var messages = await _chatMessageRepository
                .GetAllListAsync(m =>
                    (m.ReceiverUserId == userId && m.SenderUserId == receiverId) ||
                    (m.ReceiverUserId == receiverId && m.SenderUserId == userId));

            foreach (var message in messages.Where(m => m.ReceiverUserId == userId && !m.IsRead))
            {
                message.IsRead = true;
            }
            await _unitOfWorkManager.Current.SaveChangesAsync();

            var senderIds = messages.Select(m => m.SenderUserId).Distinct();
            var receiverIds = messages.Select(m => m.ReceiverUserId).Distinct();
            var userIds = senderIds.Union(receiverIds).Distinct().ToList();

            var users = await _userRepository.GetAllListAsync(u => userIds.Contains(u.Id));
            var userDict = users.ToDictionary(u => u.Id, u => u.UserName);

            return messages.Select(m => new ChatMessageDto
            {
                SenderUserId = m.SenderUserId,
                SenderUserName = userDict[m.SenderUserId],
                ReceiverUserId = m.ReceiverUserId,
                ReceiverUserName = userDict[m.ReceiverUserId],
                Message = m.Message,
                CreationTime = m.CreationTime,
                IsRead = m.IsRead
            }).ToList();
        }

        public async Task<List<UserChatDTO>> GetAllUserChats()
        {
            var userId = AbpSession.UserId.Value; // Assuming user is authenticated
            var sentMessages = await _chatMessageRepository.GetAllListAsync(m => m.SenderUserId == userId);
            var receivedMessages = await _chatMessageRepository.GetAllListAsync(m => m.ReceiverUserId == userId);

            var receiverIds = new HashSet<long>(sentMessages.Select(m => m.ReceiverUserId)
                .Concat(receivedMessages.Select(m => m.SenderUserId)));

            var users = new List<UserChatDTO>();
            foreach (var receiverId in receiverIds)
            {
                var user = await _userRepository.GetAsync(receiverId);
                if (user != null)
                {
                    var userDto = new UserChatDTO
                    {
                        RecieverId = user.Id,
                        UserName = user.UserName,
                        Image = user.Image
                    };
                    users.Add(userDto);
                }
            }

            return users;
        }

        public async Task<ChatMessageDto> GetTheLastMsg(int receiverId)
        {
            var userId = AbpSession.UserId.Value; // Assuming user is authenticated
            var messages = await _chatMessageRepository.GetAllListAsync(
                m => (m.SenderUserId == userId && m.ReceiverUserId == receiverId) ||
                     (m.SenderUserId == receiverId && m.ReceiverUserId == userId));

            var latestMessage = messages.OrderByDescending(m => m.CreationTime).FirstOrDefault();

            if (latestMessage == null)
                return null;

            return new ChatMessageDto
            {
                SenderUserId = latestMessage.SenderUserId,
                ReceiverUserId = latestMessage.ReceiverUserId,
                Message = latestMessage.Message,
                CreationTime = latestMessage.CreationTime
            };
        }

        public async Task<int> GetUnreadMessageCount()
        {
            var userId = AbpSession.UserId.Value; // Assuming user is authenticated

            var unreadMessagesCount = await _chatMessageRepository.GetAll()
                .Where(m => m.ReceiverUserId == userId && !m.IsRead)
                .CountAsync();

            return unreadMessagesCount;
        }
    }
    }