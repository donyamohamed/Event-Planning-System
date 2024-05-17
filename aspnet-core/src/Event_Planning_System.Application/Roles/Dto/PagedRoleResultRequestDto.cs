using Abp.Application.Services.Dto;

namespace Event_Planning_System.Roles.Dto
{
    public class PagedRoleResultRequestDto : PagedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}

