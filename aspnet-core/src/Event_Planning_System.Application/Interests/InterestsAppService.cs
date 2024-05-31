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
		private readonly IRepository<User, long> _userRepository;
        private readonly UserManager _userManager;
		private readonly IMapper _mapper;

		public InterestsAppService(IRepository<Interest, int> interestRepository, UserManager userManager, IMapper mapper , IRepository<User, long> userRepository)
		{
			_interestRepository = interestRepository;
			_userManager = userManager;
			_mapper = mapper;
			_userRepository = userRepository;
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

		public async Task<List<GetAllInterstsDTO>> GetAllIntersts()
		{
			var Interests = await _interestRepository.GetAll().ToListAsync();
			return _mapper.Map<List<GetAllInterstsDTO>>(Interests);
		}

		public async Task<bool> GetHasInterests()
		{
            var UserId = AbpSession.UserId.Value;
			var user = await _userRepository.GetAll().Where(a=>a.Id==UserId).Include(a=>a.Interests).FirstOrDefaultAsync();

            return user.Interests.Any();

        }



        //public async Task addUserInterests(List<int> interestIds )
        //{
        //	var UserId = AbpSession.UserId.Value;
        //	var user = await _userRepository.GetAsync(UserId);

        //	foreach ( var interestId in interestIds)
        //	{
        //		if(!user.Interests.Any(a=>a.Id == interestId))
        //		{
        //		user.Interests.Add(new Interest() { Id = interestId });
        //		}
        //	}

        //	 await _userRepository.UpdateAsync(user);

        //      }



        public async Task addUserInterests(List<int> interestIds)
		{
			var UserId = AbpSession.UserId.Value;
			var user = await _userRepository.GetAsync(UserId);


            user.Interests= interestIds.Select(id=> new Interest() { Id = id }).ToList();

            await _userRepository.UpdateAsync(user);

		}

	}
}
