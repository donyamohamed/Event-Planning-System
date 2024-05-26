using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Guest;
using Event_Planning_System.Guest.Dto;
using Event_Planning_System.UserProfile;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/[controller]/[action]")]
    public class GuestController: AbpController
    {
        private readonly IGuestAppService _guestAppService;
        public GuestController(IGuestAppService _guestAppService)
        {
            this._guestAppService = _guestAppService;
        }
       

    }
}
