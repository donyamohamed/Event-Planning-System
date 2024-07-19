using Abp.AutoMapper;
using Abp.Domain.Entities;
using Event_Planning_System.Enitities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Event_Planning_System.Enitities;
using Abp.Application.Services.Dto;
using Event_Planning_System.Authorization.Users;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace Event_Planning_System.Event.Dto
{
    public enum EventCategory
    {
        Concert,
        Conference,
        Workshop,
        Seminar,
        Party,
        Exam,
        Birthday,
        Graduation,
        Baby_Shower,
        Wedding,
        Gathering,
        Other
    }
    [AutoMap(typeof(Enitities.Event))]
    public class EventDto : IEntityDto<int>
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Event name is required.")]
        [StringLength(100, ErrorMessage = "Event name can't be longer than 100 characters.")]
        public string Name { get; set; }

        [StringLength(500, ErrorMessage = "Description can't be longer than 500 characters.")]
        public string Description { get; set; } 

        [Required(ErrorMessage = "Location is required.")]
        [StringLength(200, ErrorMessage = "Location can't be longer than 200 characters.")]
        public string Location { get; set; }
        

        [Required(ErrorMessage = "Start date is required.")]
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "End date is required.")]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }
		public bool isRead { get; set; } = false;
		public bool IsPublic { get; set; }

        private int _maxCount;

        [Range(1, 10000, ErrorMessage = "Max count must be between 1 and 10000.")]
        public int MaxCount
        {
            get => _maxCount;
            set
            {
                _maxCount = value;
                NumberOfTickets = value;
            }
        }

        public int NumberOfTickets { get; set; }

        [RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
        public string EventImg { get; set; }

        public string Category { get; set; }


        public long UserId { get; set; }
     
        
   

      
        public IFormFile EventImgFile { get; set; }
        public EventType Type { get; set; }

        public int? TicketPrice { get; set; }

        public PlaceState RequestPlace { get; set; }

        public string PlaceName { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public string ContactEmail { get; set; }
        public bool IsTransient()
        {
            throw new NotImplementedException();
        }
    }
}
