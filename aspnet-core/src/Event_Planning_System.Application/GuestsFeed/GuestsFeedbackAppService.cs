using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Feedback.Dto;
using Event_Planning_System.GuestsFeed.DTO;
using Event_Planning_System.Entities;
using System.Threading.Tasks;
using Event_Planning_System.GuestsFeed;

namespace Event_Planning_System
{
	public class GuestsFeedbackAppService : ApplicationService, IGuestsFeedbackAppService
	{
		private readonly IRepository<GuestsFeedback, int> _repository;
		private readonly IMapper _mapper;

		public GuestsFeedbackAppService(
			IRepository<GuestsFeedback, int> repository,
			IMapper mapper)
		{
			_repository = repository;
			_mapper = mapper;
		}

		public async Task<int> Add(GuestFeedDTO feedback)
		{
			var feedbackEntity = _mapper.Map<GuestsFeedback>(feedback);
			return await _repository.InsertAndGetIdAsync(feedbackEntity);
		}
	}
}
