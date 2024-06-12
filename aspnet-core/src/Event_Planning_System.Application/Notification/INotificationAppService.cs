using Event_Planning_System.Enitities;
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
    }
}
