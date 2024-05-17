using Abp.Application.Services;
using Event_Planning_System.MultiTenancy.Dto;

namespace Event_Planning_System.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

