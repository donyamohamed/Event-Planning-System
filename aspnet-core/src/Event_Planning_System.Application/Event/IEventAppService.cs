using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Event_Planning_System.Event.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Event_Planning_System.Event
{
    public interface IEventAppService : IAsyncCrudAppService<EventDto, int, EventDto, EventDto>
    {
        Task<CreateEventDto> CreateWithImageAsync(CreateEventDto input);
        Task<List<EventDto>> GetUserEventsAsync(long userId);
        Task<List<EventDto>> GetUpcomingEventsForCurrentUserAsync(long userId);
        Task<List<EventDto>> GetHistoryEventAsync(long userId);
        Task<List<EventDto>> GetPublicEventsByInterest();
    }

}
