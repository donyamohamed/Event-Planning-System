using Abp.Authorization.Users;
using Event_Planning_System.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Chats.DTO
{
	public class UserChatDTO
	{
		public long RecieverId { get; set; }
		[Required]
		[StringLength(AbpUserBase.MaxUserNameLength)]
		public string UserName { get; set; }

		[RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
		public virtual string Image { get; set; }

	}
}
