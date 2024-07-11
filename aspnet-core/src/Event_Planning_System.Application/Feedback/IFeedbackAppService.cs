using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Event_Planning_System.Feedback.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Event_Planning_System.Feedback
{
    public interface IFeedbackAppService : IAsyncCrudAppService<FeedbackDto, int>
    {
        Task<List<FeedbackDto>> GetFeedbackByEventId(int eventId);
        Task<(double averageRating, int numberOfRaters)> GetAverageRating(int eventId);
    }
}
