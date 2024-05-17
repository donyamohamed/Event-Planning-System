using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using Event_Planning_System.Configuration.Dto;

namespace Event_Planning_System.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : Event_Planning_SystemAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
