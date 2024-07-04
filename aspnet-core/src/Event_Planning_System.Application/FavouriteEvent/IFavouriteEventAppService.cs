using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Event_Planning_System.FavouriteEvent.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Event_Planning_System.FavouriteEvent
{
    public interface IFavouriteEventAppService : IAsyncCrudAppService<FavouriteEventDto, int>
    {
        Task<List<FavouriteEventDto>> GetSavedEvent(long userId);
    }
}
