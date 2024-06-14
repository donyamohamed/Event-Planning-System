using Abp.Notifications;
using Event_Planning_System.Enitities;
using Event_Planning_System.Notification.Dto;
using Event_Planning_System.Notification.Dto.Event_Planning_System.Notification.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Notification
{
	internal interface INotificationAppService
	{
		Task<List<notification>> GetAllUserNotifications();
		Task<int> CreateNotification(NotificationDto input);
		Task<int> GetNotificationCount();
		Task UpdateNotificationStatus(UpdateNotificationStatusDTO input);
	}
}
