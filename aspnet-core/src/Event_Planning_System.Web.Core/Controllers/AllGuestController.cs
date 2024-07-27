using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.AllGuest;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AllGuestController : AbpController
    {
        private readonly AllGuestService _allguestService;

        public AllGuestController(AllGuestService allguestService)
        {
            _allguestService = allguestService;
        }

        //[HttpGet]
        //public async Task<IActionResult> GetGuestCountByEventId(int eventId)
        //{
        //    var guestCount = await _allguestService.GetGuestCountByEventId(eventId);
        //    return Ok(guestCount);
        //}
    }
}
