using Abp.Application.Services;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.UI;
using AutoMapper;
using Event_Planning_System.Enitities;
using Event_Planning_System.Guest.Dto;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Event_Planning_System.Guest
{
    public class GuestAppService : AsyncCrudAppService<Enitities.Guest, GuestDto, int>, IGuestAppService
    {

        private readonly IRepository<Enitities.Guest, int> _repository;
        private readonly IRepository<Enitities.Event, int> _repositoryEvent;

        private readonly IMapper _mapper;

        public GuestAppService(IRepository<Enitities.Guest, int> repository, IMapper mapper, IRepository<Enitities.Event, int> repositoryEvent) : base(repository)
        {
            _repository = repository;
            _repositoryEvent= repositoryEvent;
            _mapper = mapper;
        }

        public async Task<List<GuestDto>> GetEventGuestsAsync(int eventId)
        {
            var guests = await _repository.GetAllListAsync(g => g.Events.Any(e => e.Id == eventId));
            return _mapper.Map<List<GuestDto>>(guests);
        }
        public async Task Add(Enitities.Guest guest, int eventId)
        {
            var eventUser = await _repositoryEvent.FirstOrDefaultAsync(eventId);
            if (eventUser == null)
            {
                throw new EntityNotFoundException(typeof(Enitities.Event), eventId);
            }
            eventUser.Guests.Add(guest);
            await _repositoryEvent.UpdateAsync(eventUser);
        }

    }
}
