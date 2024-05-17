using System.Threading.Tasks;
using Event_Planning_System.Models.TokenAuth;
using Event_Planning_System.Web.Controllers;
using Shouldly;
using Xunit;

namespace Event_Planning_System.Web.Tests.Controllers
{
    public class HomeController_Tests: Event_Planning_SystemWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}