using Abp.Application.Services;
using Event_Planning_System.Guest.Dto;
using Event_Planning_System.Guest;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Entities;
using Event_Planning_System.Supplier.DTO;
using Abp.Domain.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Event_Planning_System.UserProfile;
using Event_Planning_System.Image;
using AutoMapper;
using Event_Planning_System.Event.Dto;
using Abp.Domain.Entities;
using Event_Planning_System.Authorization.Users;

namespace Event_Planning_System.Supplier
{
	public class SupplierLocationAppService : AsyncCrudAppService<SupplierPlaces, SupplierPlacesDTO, int>, ISupplierLocationsAppService
	{
		private readonly IRepository<SupplierPlaces, int> _repository;
    
        private readonly IRepository<Enitities.Event, int> _eventrepository;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IRepository<Authorization.Users.User,long> _userrepository;
        private readonly IMapper _mapper;
		public SupplierLocationAppService(IRepository<SupplierPlaces, int> repository, IRepository<Enitities.Event, int> eventrepository, IRepository<Authorization.Users.User, long> userrepository, ICloudinaryService cloudinaryService,IMapper mapper) : base(repository)

		{
			_repository = repository;
			_cloudinaryService = cloudinaryService;
			_mapper = mapper;
            _eventrepository= eventrepository;
            _userrepository = userrepository;
		}

		[HttpPost]
		public async Task CreateSupplierPlace([FromForm] SupplierPlacesDTO supplierPlace)
		{
			string imagePath = null;

			if (supplierPlace.ImagePath != null && supplierPlace.ImagePath.Length > 0)
			{
				using (var memoryStream = new MemoryStream())
				{
					await supplierPlace.ImagePath.CopyToAsync(memoryStream);
					memoryStream.Position = 0;

					var uploadResult = await _cloudinaryService.UploadImageAsync(memoryStream, supplierPlace.ImagePath.FileName);
					imagePath = uploadResult.SecureUrl.AbsoluteUri;
				}
			}
			var suplierEntitty = _mapper.Map<SupplierPlaces>(supplierPlace);
			suplierEntitty.Image = imagePath;
			suplierEntitty.UserId= AbpSession.UserId.Value;
			await _repository.InsertAsync(suplierEntitty);
			await CurrentUnitOfWork.SaveChangesAsync();
		}
        public async Task<List<GetSupplierPlaces>> GetPlacesByCategory(EventCategory category)
        {
            var places = await _repository.GetAllListAsync(p => p.eventCategory == category);
            return ObjectMapper.Map<List<GetSupplierPlaces>>(places);
        }
        public async Task<List<EventDto>> GetPendingEventsBySupplierIdAsync(long userId)
        {
            // Get supplier places for the user
            var supplierPlaces = await _repository.GetAllListAsync(sp => sp.UserId == userId);
            var supplierPlaceIds = supplierPlaces.Select(sp => sp.Id).ToList();

            // Get events for the supplier places
            var events = await _eventrepository.GetAllListAsync(e => supplierPlaceIds.Contains(e.PlaceId.Value) && e.RequestPlace == PlaceState.Pendding);

            var eventDtos = new List<EventDto>();

            foreach (var eventEntity in events)
            {
                // Fetch the user details
                var user = await _userrepository.GetAsync(eventEntity.UserId);

                // Map event to EventDto and include the user details
                var eventDto = ObjectMapper.Map<EventDto>(eventEntity);
                eventDto.PlaceName = eventEntity.SupplierPlaces?.Name;
                eventDto.UserName = user.Name;
                eventDto.UserEmail = user.EmailAddress;

                eventDtos.Add(eventDto);
            }

            return eventDtos;
        }

        public async Task<int> GetPendingEventsCountBySupplierIdAsync(long userId)
        {
            var supplierPlaces = await _repository.GetAllListAsync(sp => sp.UserId == userId);
            var supplierPlaceIds = supplierPlaces.Select(sp => sp.Id).ToList();
            var pendingEventsCount = await _eventrepository.CountAsync(e => supplierPlaceIds.Contains(e.PlaceId.Value) && e.RequestPlace == PlaceState.Pendding);
            return pendingEventsCount;
        }

        public async Task AcceptEventAsync(int eventId)
        {
           
            var eventItem = await _eventrepository.FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventItem != null)
            {
                eventItem.RequestPlace =PlaceState.Accepted;
                await _eventrepository.UpdateAsync(eventItem);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
            else
            {
                throw new EntityNotFoundException($"Event with id {eventId} not found.");
            }
        }
        public async Task RejectEventAsync(int eventId)
        {
            // Fetch the event by Id
            var eventItem = await _eventrepository.FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventItem != null)
            {
                eventItem.RequestPlace = PlaceState.Rejected;
                await _eventrepository.UpdateAsync(eventItem);
                await CurrentUnitOfWork.SaveChangesAsync();
            }
            else
            {
                throw new EntityNotFoundException($"Event with id {eventId} not found.");
            }
        }

        public async Task<ActionResult> GetPlaceForEvent(int eventId)
        {
            var targetEvent = await _eventrepository.FirstOrDefaultAsync(a => a.Id == eventId);
            if (targetEvent == null)
            {
                return new NotFoundObjectResult("Event not found");
            }

            if (targetEvent.PlaceId != null && targetEvent.RequestPlace == PlaceState.Accepted)
            {
                var place = await _repository.FirstOrDefaultAsync(a => a.Id == targetEvent.PlaceId);
                if (place != null)
                {
                    return new OkObjectResult(place);
                }
                return new NotFoundObjectResult("Place not found");
            }

            return new BadRequestObjectResult("This event does not contain a place or the place request is not accepted");
        }

        public async Task<List<GetSupplierPlaces>> GetPlacesBySupplier(long userId)
        {
            var places = await _repository.GetAllListAsync(p => p.UserId == userId);
            return ObjectMapper.Map<List<GetSupplierPlaces>>(places);
        }


        public async Task<List<GetSupplierPlaces>> GetAllPlacesWithSupplierInfo()
        {
            var places = await _repository.GetAllListAsync();
            var placeDtos = ObjectMapper.Map<List<GetSupplierPlaces>>(places);

            foreach (var place in placeDtos)
            {
                var user = await _userrepository.FirstOrDefaultAsync(u => u.Id == place.UserId);
                if (user != null)
                {
                    place.UserName = user.Name;
                    place.UserEmail = user.EmailAddress;
                }
            }

            return placeDtos;
        }

    }
}
