using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Notification;
using Microsoft.AspNetCore.Mvc;
using Event_Planning_System.Notification.Dto;

namespace Event_Planning_System.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/[controller]/[action]")]
    public class NotificationController
    {
        private readonly INotificationAppService _notificationAppService;

        public NotificationController(INotificationAppService notificationAppService)
        {
            _notificationAppService = notificationAppService;
        }

        [HttpGet]
        public async Task<ActionResult<List<GetAllNotificationsDTO>>> GetAskForInvitationNotifications(long guestId)
        {
            var notifications = await _notificationAppService.GetAskForInvitationNotifications(guestId);
            return notifications;
        }
    }
}
