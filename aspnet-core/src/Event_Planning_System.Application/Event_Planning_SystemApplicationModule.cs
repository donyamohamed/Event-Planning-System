using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Event_Planning_System.Authorization;

namespace Event_Planning_System
{
    [DependsOn(
        typeof(Event_Planning_SystemCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class Event_Planning_SystemApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<Event_Planning_SystemAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(Event_Planning_SystemApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
