using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.GuestsFeed.DTO
{
	public class GuestFeedDTO : EntityDto<int>
	{
		public int Id { get; set; }

		[Required(ErrorMessage = "Body is required.")]
		[StringLength(300, ErrorMessage = "Body cannot be longer than 300 characters.")]
		public string Body { get; set; }

		[Required(ErrorMessage = "EventId is required.")]
		public int EventId { get; set; }

		[Required(ErrorMessage = "UserId is required.")]
		public int GuestId { get; set; }

		[Required(ErrorMessage = "Rate is required.")]
		[Range(0.5, 5.0, ErrorMessage = "Rate must be between 1.0 and 5.0.")]
		public float Rate { get; set; }

		public DateTime DateTime { get; set; }
	}
}
