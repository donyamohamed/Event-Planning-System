using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Event_Planning_System.MultiTenancy;

namespace Event_Planning_System.Sessions.Dto
{
    [AutoMapFrom(typeof(Tenant))]
    public class TenantLoginInfoDto : EntityDto
    {
        public string TenancyName { get; set; }

        public string Name { get; set; }
    }
}
