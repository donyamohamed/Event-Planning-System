using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Abp.Authorization;
using Abp.Authorization.Roles;
using Abp.Authorization.Users;
using Abp.MultiTenancy;
using Event_Planning_System.Authorization;
using Event_Planning_System.Authorization.Roles;
using Event_Planning_System.Authorization.Users;

namespace Event_Planning_System.EntityFrameworkCore.Seed.Tenants
{
    public class TenantRoleAndUserBuilder
    {
        private readonly Event_Planning_SystemDbContext _context;
        private readonly int _tenantId;

        public TenantRoleAndUserBuilder(Event_Planning_SystemDbContext context, int tenantId)
        {
            _context = context;
            _tenantId = tenantId;
        }

        public void Create()
        {
            CreateRolesAndUsers();
        }

        private void CreateRolesAndUsers()
        {
            // Admin role
            var adminRole = _context.Roles.IgnoreQueryFilters().FirstOrDefault(r => r.TenantId == _tenantId && r.Name == StaticRoleNames.Tenants.Admin);
            if (adminRole == null)
            {
                adminRole = _context.Roles.Add(new Role(_tenantId, StaticRoleNames.Tenants.Admin, StaticRoleNames.Tenants.Admin) { IsStatic = true }).Entity;
                _context.SaveChanges();
            }

            // Grant all permissions to admin role
            GrantPermissions(adminRole, MultiTenancySides.Tenant);

            // Subelier role for tenant
            var supplierRole = _context.Roles.IgnoreQueryFilters().FirstOrDefault(r => r.TenantId == _tenantId && r.Name == StaticRoleNames.Tenants.Supplier);
            if (supplierRole == null)
            {
                supplierRole = _context.Roles.Add(new Role(_tenantId, StaticRoleNames.Tenants.Supplier, StaticRoleNames.Tenants.Supplier) { IsStatic = true }).Entity;
                _context.SaveChanges();
            }

            // Grant necessary permissions to Subelier role
            GrantPermissions(supplierRole, MultiTenancySides.Tenant);

            // Admin user
            CreateAdminUser(adminRole);
        }

        private void GrantPermissions(Role role, MultiTenancySides sides)
        {
            var grantedPermissions = _context.Permissions.IgnoreQueryFilters()
                .OfType<RolePermissionSetting>()
                .Where(p => p.TenantId == _tenantId && p.RoleId == role.Id)
                .Select(p => p.Name)
                .ToList();

            var permissions = PermissionFinder
                .GetAllPermissions(new Event_Planning_SystemAuthorizationProvider())
                .Where(p => p.MultiTenancySides.HasFlag(sides) && !grantedPermissions.Contains(p.Name))
                .ToList();

            if (permissions.Any())
            {
                _context.Permissions.AddRange(
                    permissions.Select(permission => new RolePermissionSetting
                    {
                        TenantId = _tenantId,
                        Name = permission.Name,
                        IsGranted = true,
                        RoleId = role.Id
                    })
                );
                _context.SaveChanges();
            }
        }

        private void CreateAdminUser(Role adminRole)
        {
            var adminUser = _context.Users.IgnoreQueryFilters().FirstOrDefault(u => u.TenantId == _tenantId && u.UserName == AbpUserBase.AdminUserName);
            if (adminUser == null)
            {
                var user = new User
                {
                    TenantId = _tenantId,
                    UserName = AbpUserBase.AdminUserName,
                    Name = "Admin",
                    Surname = "Admin",
                    EmailAddress = "admin@defaulttenant.com",
                    IsEmailConfirmed = true,
                    IsActive = true
                };

                user.Password = new PasswordHasher<User>(new OptionsWrapper<PasswordHasherOptions>(new PasswordHasherOptions())).HashPassword(user, "123qwe");
                user.SetNormalizedNames();

                adminUser = _context.Users.Add(user).Entity;
                _context.SaveChanges();

                // Assign Admin role to admin user
                _context.UserRoles.Add(new UserRole(_tenantId, adminUser.Id, adminRole.Id));
                _context.SaveChanges();
            }
        }
    }
}
