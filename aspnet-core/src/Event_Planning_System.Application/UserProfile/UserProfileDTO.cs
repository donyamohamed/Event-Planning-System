using Abp.Authorization.Users;
using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.UserProfile
{
	public class UserProfileDTO
	{
		public long Id { get; set; }
		[Required]
		[StringLength(AbpUserBase.MaxUserNameLength)]
		public string UserName { get; set; }

		[Required]
		[StringLength(AbpUserBase.MaxNameLength)]
		public string Name { get; set; }

		[Required]
		[EmailAddress]
		[StringLength(AbpUserBase.MaxEmailAddressLength)]
		public string EmailAddress { get; set; }
		[Required(ErrorMessage = "Age is required.")]
		[Range(16, 70, ErrorMessage = "Age must be between 16 and 70.")]
		public virtual int Age { get; set; }


		[Required(ErrorMessage = "Gender is required.")]
		[RegularExpression("^(male|female)$", ErrorMessage = "Gender must be either 'male' or 'female'.")]
		public virtual Gender GenderUser { get; set; }

		[RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
		public virtual string ImageName { get; set; }
	}
}
