using Abp.Application.Services;

using Event_Planning_System.Enitities;

using Event_Planning_System.Event.Dto;
using Event_Planning_System.Interests.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Interests
{

	public interface IUserIntersets
	{
		Task<List<GetUserInterestsDTO>> GetUserIntersts();

		Task <List<GetAllInterstsDTO>> GetAllInterstsDTO();
		
		Task Delete(int? id);
		Task Add(int? interestId);
		Task<List<Interest>> GetAllInterests();

	}
}
