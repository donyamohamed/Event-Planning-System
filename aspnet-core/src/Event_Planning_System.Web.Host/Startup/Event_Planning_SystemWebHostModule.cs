using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Event_Planning_System.Configuration;

namespace Event_Planning_System.Web.Host.Startup
{
    [DependsOn(
       typeof(Event_Planning_SystemWebCoreModule))]
    public class Event_Planning_SystemWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public Event_Planning_SystemWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(Event_Planning_SystemWebHostModule).GetAssembly());
        }
    }
}
