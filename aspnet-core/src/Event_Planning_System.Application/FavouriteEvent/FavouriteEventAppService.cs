using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Event_Planning_System.FavouriteEvent.Dto;
using Abp.Domain.Repositories;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace Event_Planning_System.FavouriteEvent
{
    public class FavouriteEventAppService : AsyncCrudAppService<Entities.FavoriteEvent, FavouriteEventDto, int>, IFavouriteEventAppService
    {
        private readonly IRepository<Entities.FavoriteEvent, int> _repository;
        private readonly IMapper _mapper;

        public FavouriteEventAppService(
            IRepository<Entities.FavoriteEvent, int> repository,
            IMapper mapper)
            : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<List<FavouriteEventDto>> GetSavedEvent(long userId)
        {
                var savedEvents = await _repository.GetAll()
                    .Include(f => f.Event)
                    .Where(f => f.UserId == userId)
                    .ToListAsync();

                var savedEventDtos = _mapper.Map<List<FavouriteEventDto>>(savedEvents);

                return savedEventDtos;
            
        }
    }
}
