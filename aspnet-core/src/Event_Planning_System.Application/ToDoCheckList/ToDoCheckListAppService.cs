using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.ToDoCheckList.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Event_Planning_System.ToDoCheckList
{
    public class ToDoCheckListAppService : AsyncCrudAppService<Enitities.ToDoCheckList, ToDoListDto, int>, IToDoCheckListAppService
    {
        private readonly IRepository<Enitities.ToDoCheckList, int> _repository;
        private readonly IMapper _mapper;

        public ToDoCheckListAppService(IRepository<Enitities.ToDoCheckList, int> repository, IMapper mapper) : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<ToDoListDto>> GetToListEventAsync(int eventId)
        {
            var Todolist = await _repository.GetAllListAsync(e => e.EventId == eventId);
            return _mapper.Map<List<ToDoListDto>>(Todolist);
        }
    }
}
