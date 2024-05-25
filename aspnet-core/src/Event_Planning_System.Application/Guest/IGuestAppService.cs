using Abp.Application.Services;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Guest.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Guest
{
    public interface IGuestAppService : IApplicationService //IAsyncCrudAppService<GuestDto, long> //IApplicationService
    {
        Task<List<GuestDto>> GetAllAsync();
        Task<GuestDto> GetByIdAsync(int id);
        Task<GuestDto> Update(int id, Enitities.Guest guest);
        Task<GuestDto> Delete(int id);
        Task<GuestDto> CreateGuest(Enitities.Guest guest);
    }
}
