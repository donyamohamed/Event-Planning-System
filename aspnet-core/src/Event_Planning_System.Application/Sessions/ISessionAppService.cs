using System.Threading.Tasks;
using Abp.Application.Services;
using Event_Planning_System.Sessions.Dto;

namespace Event_Planning_System.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
