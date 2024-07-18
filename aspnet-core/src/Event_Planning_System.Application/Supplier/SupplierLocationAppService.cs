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

namespace Event_Planning_System.Supplier
{
	public class SupplierLocationAppService : AsyncCrudAppService<SupplierPlaces, SupplierPlacesDTO, int>, ISupplierLocationsAppService
	{
		private readonly IRepository<SupplierPlaces, int> _repository;
        private readonly IRepository<Enitities.Event, int> _eventrepository;
        private readonly ICloudinaryService _cloudinaryService;
		private readonly IMapper _mapper;
		public SupplierLocationAppService(IRepository<SupplierPlaces, int> repository, IRepository<Enitities.Event, int> eventrepository, ICloudinaryService cloudinaryService,IMapper mapper) : base(repository)
		{
			_repository = repository;
			_cloudinaryService = cloudinaryService;
			_mapper = mapper;
            _eventrepository= eventrepository;

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
           
            var supplierPlaces = await _repository.GetAllListAsync(sp => sp.UserId == userId);
            var supplierPlaceIds = supplierPlaces.Select(sp => sp.Id).ToList();
            var events = await _eventrepository.GetAllListAsync(e => supplierPlaceIds.Contains(e.PlaceId.Value) && e.RequestPlace == PlaceState.Pendding);
            return ObjectMapper.Map<List<EventDto>>(events);
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





    }
}
