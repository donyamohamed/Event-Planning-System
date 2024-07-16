using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Event_Planning_System.FavouriteEvent.Dto;
using Abp.Domain.Repositories;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

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

        public async  Task<FavouriteEventDto> SaveEvent(FavouriteEventDto input)
        {
            // Check if the favorite event already exists for the user
            var existingFavorite = await _repository.FirstOrDefaultAsync(f =>
                f.EventId == input.EventId && f.UserId == input.UserId);

            if (existingFavorite != null)
            {
                // Handle the case where the favorite event already exists
                // You can throw an exception, return null, or update the existing favorite
                // For example, you might want to throw an exception to indicate a duplicate favorite event.
                throw new ApplicationException("Favorite event already exists for this user.");
            }

            // If it doesn't exist, proceed to create a new favorite event
            var favoriteEvent = ObjectMapper.Map<Entities.FavoriteEvent>(input);
            await _repository.InsertAsync(favoriteEvent);
            await CurrentUnitOfWork.SaveChangesAsync();

            return ObjectMapper.Map<FavouriteEventDto>(favoriteEvent);
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
        public async Task<bool> IsEventSaved(long userId, int eventId)
        {
            var existingFavorite = await _repository.FirstOrDefaultAsync(f =>
                f.EventId == eventId && f.UserId == userId);

            return existingFavorite != null;
        }

    }
}
