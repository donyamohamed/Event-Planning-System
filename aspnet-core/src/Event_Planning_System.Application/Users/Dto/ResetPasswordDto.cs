using System.ComponentModel.DataAnnotations;

namespace Event_Planning_System.Users.Dto
{
    public class ResetPasswordDto
    {

        [Required]
        public string UserEmail { get; set; }
    }
}
