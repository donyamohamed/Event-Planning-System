using System.Threading.Tasks;
using Abp.Application.Services;
using Event_Planning_System.Authorization.Accounts.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Event_Planning_System.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        //Task<RegisterOutput> Register(RegisterInput input);
        Task<RegisterOutput> Register([FromForm] RegisterInput input);
     //Task<RegisterOutput> RegisterByGoogle(GoogleRegisterInputs input);
    }
}
