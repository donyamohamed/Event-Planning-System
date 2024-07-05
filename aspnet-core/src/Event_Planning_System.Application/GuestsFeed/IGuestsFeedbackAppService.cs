using Abp.Application.Services;
using Event_Planning_System.Entities;
using Event_Planning_System.Feedback.Dto;
using Event_Planning_System.GuestsFeed.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.GuestsFeed
{
	public interface IGuestsFeedbackAppService 
	{
		Task<int> Add(GuestFeedDTO feedback);
	}
}
