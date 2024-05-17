using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Event_Planning_System.Configuration;
using Event_Planning_System.Web;

namespace Event_Planning_System.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class Event_Planning_SystemDbContextFactory : IDesignTimeDbContextFactory<Event_Planning_SystemDbContext>
    {
        public Event_Planning_SystemDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<Event_Planning_SystemDbContext>();
            
            /*
             You can provide an environmentName parameter to the AppConfigurations.Get method. 
             In this case, AppConfigurations will try to read appsettings.{environmentName}.json.
             Use Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") method or from string[] args to get environment if necessary.
             https://docs.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli#args
             */
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            Event_Planning_SystemDbContextConfigurer.Configure(builder, configuration.GetConnectionString(Event_Planning_SystemConsts.ConnectionStringName));

            return new Event_Planning_SystemDbContext(builder.Options);
        }
    }
}
