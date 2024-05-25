using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.SMS
{

    public interface ISmsService : IApplicationService
    {
        Task SendSmsAsync(string toPhoneNumber, string message);
    }
}

