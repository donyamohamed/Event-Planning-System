using AutoMapper;
using Event_Planning_System.Entities;
using Event_Planning_System.GuestsFeed.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.GuestsFeed.Mapping
{
	public class feedMapping:Profile
	{
        public feedMapping()
        {
            //CreateMap<GuestsFeedback, GuestFeedDTO>();
			CreateMap<GuestFeedDTO,GuestsFeedback>();


		}
	}
}
