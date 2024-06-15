using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using Event_Planning_System.Event.Dto;
using Event_Planning_System.Interests.DTO;
using Event_Planning_System.Notification.Dto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Notification
{
    public class NotificationAppService : ApplicationService, INotificationAppService
    {
        private readonly IRepository<notification, int> _notificationRepository;
        private readonly IRepository<User, long> _userRepository;
        private readonly UserManager _userManager;
        private readonly IMapper _mapper;

        public NotificationAppService(
            IRepository<notification, int> notificationRepository,
            UserManager userManager,
            IMapper mapper,
            IRepository<User, long> userRepository)
        {
            _notificationRepository = notificationRepository;
            _userManager = userManager;
            _mapper = mapper;
            _userRepository = userRepository;
        }

		public async Task<int> CreateNotification(NotificationDto input)
		{
			var notification = _mapper.Map<notification>(input);
			await _notificationRepository.InsertAsync(notification);
			return notification.Id;
		}

		public async Task<List<notification>> GetAllUserNotifications()
		{
			var userId = AbpSession.UserId.Value;
			var AllNotifications =await _notificationRepository.GetAll().Where(i => i.UserId == userId).ToListAsync();
			return AllNotifications;
		}

		public async Task<int> GetNotificationCount()
		{
			var notifications = await GetAllUserNotifications();
			var NewNotification = notifications.Where(n => n.isRead == false).Count();
			return NewNotification;
		}

		public async Task UpdateNotificationStatus([FromBody]UpdateNotificationStatusDTO input)
		{
			var notifications = await GetAllUserNotifications();
			var old=notifications.FirstOrDefault(n=>n.Id == input.Id);	
			if (old == null)
			{
				throw new Abp.UI.UserFriendlyException("Notification not found");
			}

			old.status = input.status;
			//old.Content = input.content;
			await _notificationRepository.UpdateAsync(old);
		}

	}
}
