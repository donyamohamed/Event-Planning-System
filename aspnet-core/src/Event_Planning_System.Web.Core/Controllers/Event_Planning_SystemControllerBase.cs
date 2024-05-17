using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Event_Planning_System.Controllers
{
    public abstract class Event_Planning_SystemControllerBase: AbpController
    {
        protected Event_Planning_SystemControllerBase()
        {
            LocalizationSourceName = Event_Planning_SystemConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
