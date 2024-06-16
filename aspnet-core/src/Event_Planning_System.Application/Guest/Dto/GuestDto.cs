using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Event_Planning_System.Enitities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Guest.Dto
{
    [AutoMapFrom(typeof(Enitities.Guest))]
    public class GuestDto : IEntityDto<int>
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Invitation state is required.")]
        public string InvitationState { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Phone is required.")]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Phone must be a 10-digit number.")]
        public string Phone { get; set; }
        public long UserId { get; set; }
        public int EventId { get; set; }
    }
}
