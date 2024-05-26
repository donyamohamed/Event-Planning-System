using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Email
{
    public interface IEmailService : IApplicationService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
    }
}
