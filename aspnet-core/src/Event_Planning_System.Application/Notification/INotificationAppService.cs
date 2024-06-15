
﻿using Abp.Notifications;
using Event_Planning_System.Enitities;
using Event_Planning_System.Notification.Dto;
using Microsoft.AspNetCore.Mvc;

using Abp.Application.Services;
using Event_Planning_System.Enitities;
using Event_Planning_System.Notification.Dto;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Notification
{
	public interface INotificationAppService
	{
		Task<List<notification>> GetAllUserNotifications();
		Task<int> CreateNotification(NotificationDto input);
		Task<int> GetNotificationCount();
		Task UpdateNotificationStatus(UpdateNotificationStatusDTO input);
	}
}
