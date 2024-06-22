using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Authorization.Accounts.Dto
{
    internal class GoogleRegisterOutput
    {
        public bool CanLogin { get; set; }
public string accessToken { get; set; }
    }
}
