using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Event_Planning_System.Enitities;
using Event_Planning_System.Interests.DTO;
using Event_Planning_System.Notification.Dto;
namespace Event_Planning_System.Notification.Mapping
{
	public class NotificationMapping :Profile
    {
        public NotificationMapping()
        {

			CreateMap<notification, NotificationDto>();
            CreateMap<NotificationDto, notification>();
        

			CreateMap<notification, GetAllNotificationsDTO>();
		}

    }
}
