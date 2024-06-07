using Abp.Application.Services;

using Event_Planning_System.ToDoCheckList.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.ToDoCheckList
{
    public interface IToDoCheckListAppService : IAsyncCrudAppService<ToDoListDto, int>
    {
        Task<List<ToDoListDto>> GetToListEventAsync(int eventId);
        
    }
}
