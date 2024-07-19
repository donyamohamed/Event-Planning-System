using Abp.Application.Services.Dto;
using Abp.Application.Services;
using Event_Planning_System.Event.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Supplier.DTO;
using Event_Planning_System.Guest.Dto;

namespace Event_Planning_System.Supplier
{
	public interface ISupplierLocationsAppService : IAsyncCrudAppService<SupplierPlacesDTO, int>
	{
        Task<List<GetSupplierPlaces>> GetPlacesByCategory(EventCategory category);
        Task<List<GetSupplierPlaces>> GetAllPlacesWithSupplierInfo();
        Task<List<GetSupplierPlaces>> GetPlacesBySupplier(long userId);

    }
}
