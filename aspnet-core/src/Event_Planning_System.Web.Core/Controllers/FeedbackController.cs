using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Feedback;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : AbpController
    {
        private readonly IFeedbackAppService _repository;

        public FeedbackController(IFeedbackAppService repository)
        {
            _repository = repository;
        }

        [HttpGet("CalculateAverageRating/{eventId}")]
        public async Task<IActionResult> CalculateAverageRating(int eventId)
        {
            var result = await _repository.GetAverageRating(eventId);

            return Ok(new
            {
                AverageRating = result.averageRating,
                NumberOfRaters = result.numberOfRaters
            });
        }
    }

}
