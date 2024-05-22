using Abp.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Enitities
{
    public class CustomUser : AbpUserBase
    {
       
        [Range(16, 70, ErrorMessage = "Age must be between 16 and 70.")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        [RegularExpression("^(male|female)$", ErrorMessage = "Gender must be either 'male' or 'female'.")]
        public string Gender { get; set; }

        [RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
        public string ImageName { get; set; }
    }

}

