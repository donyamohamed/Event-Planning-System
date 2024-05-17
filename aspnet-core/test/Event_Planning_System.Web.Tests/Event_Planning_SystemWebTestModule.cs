using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Event_Planning_System.EntityFrameworkCore;
using Event_Planning_System.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace Event_Planning_System.Web.Tests
{
    [DependsOn(
        typeof(Event_Planning_SystemWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class Event_Planning_SystemWebTestModule : AbpModule
    {
        public Event_Planning_SystemWebTestModule(Event_Planning_SystemEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(Event_Planning_SystemWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(Event_Planning_SystemWebMvcModule).Assembly);
        }
    }
}