using Abp.Application.Services;
using System.Threading.Tasks;

namespace Event_Planning_System.AllGuest
{
    public interface IAllGuestService : IApplicationService
    {
        Task<int> GetGuestCountByEventId(int eventId);
    }
}
