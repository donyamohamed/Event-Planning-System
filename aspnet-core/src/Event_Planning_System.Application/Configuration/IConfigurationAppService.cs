using System.Threading.Tasks;
using Event_Planning_System.Configuration.Dto;

namespace Event_Planning_System.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
