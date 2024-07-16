using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Event_Planning_System.FavouriteEvent.Dto;
using Event_Planning_System.FavouriteEvent;
using System;

namespace Event_Planning_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavouriteEventController : ControllerBase
    {
        private readonly IFavouriteEventAppService _favouriteEventAppService;

        public FavouriteEventController(IFavouriteEventAppService favouriteEventAppService)
        {
            _favouriteEventAppService = favouriteEventAppService;
        }

      
    }
}
