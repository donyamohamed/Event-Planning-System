using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Event_Planning_System.Event.Dto;
using Event_Planning_System.UserProfile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Event
{
    public interface IEventAppService: IAsyncCrudAppService<EventDto,int>
    {

        Task<List<EventDto>> GetUserEventsAsync(long userId);

    
    }
}
