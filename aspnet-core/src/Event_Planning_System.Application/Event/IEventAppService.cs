using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Event_Planning_System.Event.Dto;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Event_Planning_System.Event
{
    public interface IEventAppService : IAsyncCrudAppService<EventDto, int, PagedAndSortedResultRequestDto, CreateEventDto, EventDto>
    {
        Task<EventDto> CreateAsync(CreateEventDto input);
        Task<List<EventDto>> GetUserEventsAsync(long userId);
        public  Task<List<EventDto>> GetReminderOfUpcomming();
		Task<List<EventDto>> GetUpcomingEventsForCurrentUserAsync(long userId);
        Task<List<EventDto>> GetHistoryEventAsync(long userId);
        Task<List<EventDto>> GetPublicEventsByInterest();
        Task<int> GetReminderCount();

		Task UpdateReminderStatus([FromBody] UpdateEventStatusDto input);
		Task DeleteEventWithDetailsAsync(int eventId);
        Task<IEnumerable<EventDto>> GetEventsByIds(IEnumerable<int> eventIds);
        Task<EventDto> GetEventByIdAsync(int id);
    }

}
