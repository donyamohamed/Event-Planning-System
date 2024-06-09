using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Event;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AutoMapper;
using System.IO;
using Event_Planning_System.Event.Dto;
using Microsoft.AspNetCore.Http;
using System;

namespace Event_Planning_System.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/[controller]/[action]")]
    public class EventController : AbpController
    {
        private readonly IEventAppService _eventService;
        private readonly IMapper _mapper;
        private readonly string _imageFolderPath;

        public EventController(IEventAppService eventService, IMapper mapper)
        {
            _eventService = eventService;
            _mapper = mapper;
            _imageFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        }

        [HttpGet]
        public async Task<IActionResult> GetUserEvents(long userId)
        {
            var events = await _eventService.GetUserEventsAsync(userId);
            if (events == null || events.Count == 0)
            {
                return NotFound("No events found for the user.");
            }
            return Ok(events);
        }

        [HttpGet]
        public async Task<IActionResult> GetUpcomingEventsForCurrentUser(long userId)
        {
            var events = await _eventService.GetUpcomingEventsForCurrentUserAsync(userId);
            if (events == null || events.Count == 0)
            {
                return NotFound("No upcoming events found for the user.");
            }
            return Ok(events);
        }

        [HttpGet]
        public async Task<IActionResult> GetHistoryEvent(long userId)
        {
            var events = await _eventService.GetHistoryEventAsync(userId);
            if (events == null || events.Count == 0)
            {
                return NotFound("No history events found for the user.");
            }
            return Ok(events);
        }

       
        [HttpPost]
        public async Task CreateWithImage([FromForm] CreateEventDto formData)
        {
            await _eventService.CreateWithImageAsync(formData)  ; 
        }
    }
    }
