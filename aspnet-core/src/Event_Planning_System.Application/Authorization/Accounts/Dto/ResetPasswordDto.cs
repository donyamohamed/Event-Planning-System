using System.ComponentModel.DataAnnotations;

namespace Event_Planning_System.Authorization.Accounts.Dto
{
    public class ResetPasswordDto
    {
        [Required]
        public string NewPassword { get; set; }

        [Required]
        public string ConfirmPassword { get; set; }
    }
}
