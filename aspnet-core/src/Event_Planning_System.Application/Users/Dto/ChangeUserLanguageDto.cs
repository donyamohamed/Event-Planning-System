using System.ComponentModel.DataAnnotations;

namespace Event_Planning_System.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}