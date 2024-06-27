using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Event_Planning_System.Roles.Dto;
using Event_Planning_System.Users.Dto;

namespace Event_Planning_System.Users
{
    public interface IUserAppService : IAsyncCrudAppService<UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>
    {
        Task DeActivate(EntityDto<long> user);
        //Task Activate(EntityDto<long> user);
         Task<string> Activate(EntityDto<long> user);
        Task<ListResultDto<RoleDto>> GetRoles();
        Task ChangeLanguage(ChangeUserLanguageDto input);

        Task<bool> ChangePassword(ChangePasswordDto input);
       Task ActivateUserById(long userId);
        Task<UserDto> GetUserById(long id);

    }
}
