using Abp.Authorization;
using Event_Planning_System.Authorization.Roles;
using Event_Planning_System.Authorization.Users;

namespace Event_Planning_System.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
