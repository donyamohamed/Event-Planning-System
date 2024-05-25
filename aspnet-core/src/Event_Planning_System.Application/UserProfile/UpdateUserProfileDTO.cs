using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.UserProfile
{
	public class UpdateUserProfileDTO
	{
		[Required]
		public string UserName { get; set; }
		[Required]
		public string emailAddress { get; set; }
		[Required]
		public virtual int Age { get; set; }
		[Required]
		public virtual Gender GenderUser { get; set; }

		[RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
		public virtual string ImageName { get; set; }
	}
}
