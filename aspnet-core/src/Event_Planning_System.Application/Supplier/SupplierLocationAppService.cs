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

namespace Event_Planning_System.Supplier
{
	public class SupplierLocationAppService : AsyncCrudAppService<SupplierPlaces, SupplierPlacesDTO, int>, ISupplierLocationsAppService
	{
		private readonly IRepository<SupplierPlaces, int> _repository;
		private readonly ICloudinaryService _cloudinaryService;
		private readonly IMapper _mapper;
		public SupplierLocationAppService(IRepository<SupplierPlaces, int> repository, ICloudinaryService cloudinaryService,IMapper mapper) : base(repository)
		{
			_repository = repository;
			_cloudinaryService = cloudinaryService;
			_mapper = mapper;
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

    }
}
