using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Event;
using Event_Planning_System.Guest;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/[controller]/[action]")]
    public class GuestController : AbpController
    {
        private readonly GuestAppService _guestService;

        public GuestController(GuestAppService guestService)
        {
            _guestService = guestService;
        }

        
        [HttpGet()]
        public async Task<IActionResult> GetEventGuestsAsync(int id)
        {
            var guests = await _guestService.GetEventGuestsAsync(id);
            if (guests == null || guests.Count == 0)
            {
                return NotFound();
            }
            return Ok(guests);
        }
    }
}
