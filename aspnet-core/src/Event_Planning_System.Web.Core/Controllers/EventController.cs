using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Event;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/[controller]/[action]")]
    public class EventController : AbpController
    {
        private readonly IEventAppService _eventService;

        public EventController(IEventAppService eventService)
        {
            _eventService = eventService;
        }

        // GET: api/Event/{userId}
        [HttpGet()]
        public async Task<IActionResult> GetUserEvents(long userId)
        {
            var events = await _eventService.GetUserEventsAsync(userId);
            if (events == null || events.Count == 0)
            {
                return NotFound();
            }
            return Ok(events);
        }
        [HttpGet]
        public async Task<IActionResult> GetHistoryEvent(long userId)
        {
            var events=await _eventService.GetHistoryEventAsync(userId);
            if (events == null || events.Count == 0)
            {
                return NotFound();
            }
            return Ok(events);

        }
    }
}

