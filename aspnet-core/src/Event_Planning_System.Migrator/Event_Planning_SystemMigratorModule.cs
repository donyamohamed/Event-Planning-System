using Microsoft.Extensions.Configuration;
using Castle.MicroKernel.Registration;
using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Event_Planning_System.Configuration;
using Event_Planning_System.EntityFrameworkCore;
using Event_Planning_System.Migrator.DependencyInjection;

namespace Event_Planning_System.Migrator
{
    [DependsOn(typeof(Event_Planning_SystemEntityFrameworkModule))]
    public class Event_Planning_SystemMigratorModule : AbpModule
    {
        private readonly IConfigurationRoot _appConfiguration;

        public Event_Planning_SystemMigratorModule(Event_Planning_SystemEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

            _appConfiguration = AppConfigurations.Get(
                typeof(Event_Planning_SystemMigratorModule).GetAssembly().GetDirectoryPathOrNull()
            );
        }

        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
                Event_Planning_SystemConsts.ConnectionStringName
            );

            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
            Configuration.ReplaceService(
                typeof(IEventBus), 
                () => IocManager.IocContainer.Register(
                    Component.For<IEventBus>().Instance(NullEventBus.Instance)
                )
            );
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(Event_Planning_SystemMigratorModule).GetAssembly());
            ServiceCollectionRegistrar.Register(IocManager);
        }
    }
}
