using AutoMapper;
using Event_Planning_System.Entities;
using Event_Planning_System.Users.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Supplier.DTO.Mapping
{
	public class SupplierMapper : Profile
	{
        public SupplierMapper()
        {
			CreateMap<SupplierPlacesDTO, SupplierPlaces>();
			CreateMap<SupplierPlaces, GetSupplierPlaces>();
		}
    }
}
