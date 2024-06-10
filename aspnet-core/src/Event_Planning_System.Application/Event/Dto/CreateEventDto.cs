using Abp.AutoMapper;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System;

namespace Event_Planning_System.Event.Dto
{
    [AutoMap(typeof(Enitities.Event))]
    public class CreateEventDto
    {
        

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

        public bool IsPublic { get; set; }

        [Range(1, 10000, ErrorMessage = "Max count must be between 1 and 10000.")]
        public int MaxCount { get; set; }

        [RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
        public string EventImg { get; set; }

        public string Category { get; set; }

        public long UserId { get; set; }

    

        public IFormFile EventImgFile { get; set; }
    }
}
