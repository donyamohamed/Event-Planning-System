using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Event_Planning_System.FavouriteEvent;
using Microsoft.Extensions.Logging;
using System;

namespace Event_Planning_System.Controllers
{
    [Route("api/services/app/[controller]")]
    public class FavouriteEventController : Controller
    {
        private readonly IFavouriteEventAppService _favouriteEventAppService;
        private readonly ILogger<FavouriteEventController> _logger;

        public FavouriteEventController(IFavouriteEventAppService favouriteEventAppService, ILogger<FavouriteEventController> logger)
        {
            _favouriteEventAppService = favouriteEventAppService;
            _logger = logger;
        }

        
        
    }
}
