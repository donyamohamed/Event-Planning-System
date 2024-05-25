using System;
using System.ComponentModel.DataAnnotations;
using Abp.Application.Services.Dto;
using Abp.Authorization.Users;
using Abp.AutoMapper;
using Event_Planning_System.Authorization.Users;

namespace Event_Planning_System.Users.Dto
{
    [AutoMapFrom(typeof(User))]
    public class UserDto : EntityDto<long>
    {
        [Required]
        [StringLength(AbpUserBase.MaxUserNameLength)]
        public string UserName { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(AbpUserBase.MaxSurnameLength)]
        public string Surname { get; set; }

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
		public virtual string Image { get; set; }

        public bool IsActive { get; set; }

        public string FullName { get; set; }

        public DateTime? LastLoginTime { get; set; }

        public DateTime CreationTime { get; set; }

        public string[] RoleNames { get; set; }
    }
}
