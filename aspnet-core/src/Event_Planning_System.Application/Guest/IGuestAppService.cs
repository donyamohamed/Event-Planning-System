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
    public interface IGuestAppService : IAsyncCrudAppService<GuestDto, int>
    {}
}
