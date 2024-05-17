using System.Threading.Tasks;
using Abp.Application.Services;
using Event_Planning_System.Authorization.Accounts.Dto;

namespace Event_Planning_System.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
