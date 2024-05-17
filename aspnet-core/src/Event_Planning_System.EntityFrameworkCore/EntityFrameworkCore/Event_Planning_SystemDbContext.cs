using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using Event_Planning_System.Authorization.Roles;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.MultiTenancy;

namespace Event_Planning_System.EntityFrameworkCore
{
    public class Event_Planning_SystemDbContext : AbpZeroDbContext<Tenant, Role, User, Event_Planning_SystemDbContext>
    {
        /* Define a DbSet for each entity of the application */
        
        public Event_Planning_SystemDbContext(DbContextOptions<Event_Planning_SystemDbContext> options)
            : base(options)
        {
        }
    }
}
