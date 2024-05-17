using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Event_Planning_System.EntityFrameworkCore
{
    public static class Event_Planning_SystemDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<Event_Planning_SystemDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<Event_Planning_SystemDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
