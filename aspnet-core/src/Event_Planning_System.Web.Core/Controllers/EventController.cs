//using Abp.AspNetCore.Mvc.Controllers;
//using Event_Planning_System.Event;
//using Event_Planning_System.Event.Dto;
//using Microsoft.AspNetCore.Mvc;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Event_Planning_System.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class EventController : ControllerBase
//    {
//        private readonly IEventAppService _eventAppService;

//        public EventController(IEventAppService eventAppService)
//        {
//            _eventAppService = eventAppService;
//        }
//        [HttpPost("CreateEvent")]
//        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto createEventDto)
//        {
//            if (!ModelState.IsValid)
//            {
//                return BadRequest(ModelState);
//            }

//            try
//            {
//                await _eventAppService.createEvent(createEventDto);
//                return Ok(new { Message = "Event created successfully" });
//            }
//            catch (Exception ex)
//            {
//                // Log the exception (not shown here)
//                return StatusCode(500, new { Message = "An error occurred while creating the event", Details = ex.Message });
//            }
//        }



//    }
//}
