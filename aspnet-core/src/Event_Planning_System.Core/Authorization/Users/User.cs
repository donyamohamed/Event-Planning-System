using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Abp.Authorization.Users;
using Abp.Extensions;
using Event_Planning_System.Enitities;
using Event_Planning_System.Entities;

namespace Event_Planning_System.Authorization.Users
{


    public class User : AbpUser<User>
    {
        public const string DefaultPassword = "123qwe";

        public static string CreateRandomPassword()
        {
            return Guid.NewGuid().ToString("N").Truncate(16);
        }
        [Required(ErrorMessage = "Age is required.")]
        [Range(16, 70, ErrorMessage = "Age must be between 16 and 70.")]
        public virtual int Age { get; set; }


        [Required(ErrorMessage = "Gender is required.")]
        [RegularExpression("^(male|female)$", ErrorMessage = "Gender must be either 'male' or 'female'.")]
        public virtual Gender GenderUser { get; set; }

        [RegularExpression(@"^.+\.(png|jpg|jpeg)$", ErrorMessage = "Image must be in PNG, JPG, or JPEG format.")]
        public virtual string Image { get; set; }


        public virtual ICollection<notification> Notifications { get; set; } = new List<notification>();
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();
        public virtual ICollection<Guest> Guests { get; set; } = new List<Guest>();
        public virtual ICollection<BudgetExpense> Budgets { get; set; } = new List<BudgetExpense>();
        public virtual ICollection<ToDoCheckList> ToDoChecks { get; set; } = new List<ToDoCheckList>();
        public virtual ICollection<Interest> Interests { get; set; } = new List<Interest>();
        public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
		public virtual ICollection<SupplierPlaces> SupplierPlaces { get; set; } = new List<SupplierPlaces>();


		public ICollection<FavoriteEvent> FavoriteEvents { get; set; } = new List<FavoriteEvent>();
        public static User CreateTenantAdminUser(int tenantId, string emailAddress )
        {
            var user = new User
            {
                TenantId = tenantId,
                UserName = AdminUserName,
                Name = AdminUserName,
                Surname = AdminUserName,
                EmailAddress = emailAddress,
                Roles = new List<UserRole>()
            };

            user.SetNormalizedNames();

            return user;
        }
    }
}
