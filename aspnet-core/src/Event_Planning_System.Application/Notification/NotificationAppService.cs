using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
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
		public NotificationAppService(IRepository<notification, int> interestRepository, UserManager userManager, IMapper mapper, IRepository<User, long> userRepository)

		{
			_notificationRepository = interestRepository;
			_userManager = userManager;
			_mapper = mapper;

			_userRepository = userRepository;
		}

		public async Task<List<notification>> GetAllUserNotifications()
		{
			var userId = AbpSession.UserId.Value;
			var AllNotifications =await _notificationRepository.GetAll().Where(i => i.UserId == userId).ToListAsync();
			return AllNotifications;
		}
	}
}
