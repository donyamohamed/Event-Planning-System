using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Enitities;
using Event_Planning_System.Interests.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Event_Planning_System.Authorization.Users;

namespace Event_Planning_System.Interests
{
	public class InterestsAppService : ApplicationService, IUserIntersets
	{
		private readonly IRepository<Interest, int> _interestRepository;
		private readonly UserManager _userManager;
		private readonly IMapper _mapper;

		public InterestsAppService(IRepository<Interest, int> interestRepository, UserManager userManager, IMapper mapper)
		{
			_interestRepository = interestRepository;
			_userManager = userManager;
			_mapper = mapper;
		}

		public Task Delete()
		{
			throw new System.NotImplementedException();
		}

		public async Task<List<GetUserInterestsDTO>> GetUserIntersts()
		{
			var userId = AbpSession.UserId.Value;
			var interests = await _interestRepository.GetAll()
				.Include(i => i.Users)
				.Where(i => i.Users.Any(u => u.Id == userId))
				.ToListAsync();

			return _mapper.Map<List<GetUserInterestsDTO>>(interests);
		}


		public async Task <List<GetAllInterstsDTO>> GetAllIntersts()
		{
			var Interests = await _interestRepository.GetAll().ToListAsync();
            return _mapper.Map<List<GetAllInterstsDTO>>(Interests);
        }
	}
}
