using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Supplier.DTO
{
	public class SupplierPlacesDTO : EntityDto<int>
	{
		public EventCategory EventCategory { get; set; }
		public decimal Price { get; set; }
		public string Name { get; set; }
		public string Location { get; set; }
		public int Capacity { get; set; }
		public IFormFile ImagePath { get; set; }
		public string ContactEmail { get; set; }
		public string Description { get; set; }
	}

}
