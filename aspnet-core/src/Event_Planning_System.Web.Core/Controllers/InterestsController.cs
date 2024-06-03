using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Interests;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
	[Route("api/[controller]/[action]")]
	public class InterestsController : AbpController
	{
		private readonly IUserIntersets _userIntersets;

		public InterestsController(IUserIntersets userIntersets)
		{
			_userIntersets = userIntersets;
		}

		//[HttpGet]
		//public async Task<List<Interests.DTO.GetUserInterestsDTO>> GetAllUserInterests()
		//{
		//	return await _userIntersets.GetUserIntersts();
		//}
	}
}
