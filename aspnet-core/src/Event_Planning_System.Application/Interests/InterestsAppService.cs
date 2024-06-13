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

using Microsoft.AspNetCore.Mvc;
using Abp.Domain.Entities;
using System;


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
		
		public async Task Add([FromHeader] int? id)
		{
			var userId = AbpSession.UserId.Value;
			var user = _userManager.GetUserById(userId);
			var interest = await _interestRepository.FirstOrDefaultAsync(id.Value);
			if (interest == null)
			{
				throw new EntityNotFoundException(typeof(Interest), id);
			}
			user.Interests.Add(interest);
			await _userManager.UpdateAsync(user);
		}
		public async Task Delete([FromHeader] int? id)
		{
			var userId = AbpSession.UserId.Value;
			var interest = await _interestRepository.GetAll()
				.Include(i => i.Users)
				.FirstOrDefaultAsync(i => i.Id == id.Value && i.Users.Any(u => u.Id == userId));

			if (interest == null)
			{
				throw new EntityNotFoundException(typeof(Interest), id.Value);
			}

			var user = interest.Users.FirstOrDefault(u => u.Id == userId);

			if (user != null)
			{
				interest.Users.Remove(user);
				await _interestRepository.UpdateAsync(interest);
			}
		}

		public async Task<List<Interest>> GetAllInterests()
		{
			var interests = await _interestRepository.GetAllListAsync();
			return interests;
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


		public async Task<List<GetAllInterstsDTO>> GetAllInterstsForChoosing()
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

		/*public async Task addUserInterests(List<int> interestIds)
		{
			var UserId = AbpSession.UserId.Value;
			var user = await _userRepository.GetAsync(UserId);

            if (user == null)
            {
                throw new Exception("User not found.");
            }

			user.Interests= interestIds.Select(id => new Interest() { Id = id }).ToList();

			await _userRepository.UpdateAsync(user);

		}*/
        public async Task addUserInterests(List<int> interestIds)
        {
            var userId = AbpSession.UserId.Value;
            var user = await _userRepository.GetAllIncluding(u => u.Interests).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new Exception("User not found.");
            }

            var interests = await _interestRepository.GetAllListAsync(i => interestIds.Contains(i.Id));

            foreach (var interest in interests)
            {
                if (!user.Interests.Any(ui => ui.Id == interest.Id))
                {
                    user.Interests.Add(interest);
                }
            }

            await _userRepository.UpdateAsync(user);
        }


    }
}
