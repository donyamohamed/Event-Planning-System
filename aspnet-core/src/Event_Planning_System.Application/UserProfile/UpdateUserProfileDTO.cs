using EllipticCurve.Utils;
using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Event_Planning_System.UserProfile
{
	public class UpdateUserProfileDTO
	{
	
		[Required]
		public string UserName { get; set; }
		
		public string EmailAddress { get; set; }
		[Required]
		public virtual int Age { get; set; }
		[Required]
		public virtual Gender GenderUser { get; set; }

		public IFormFile ImagePath { get; set; }
	}
}
