﻿using Abp.Application.Services;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Event.Dto;
using Event_Planning_System.Guest.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Guest
{
    public interface IGuestAppService : IAsyncCrudAppService<GuestDto, int>
    {
        Task<List<GuestDto>> GetEventGuestsAsync(int guestId);

        Task<IActionResult> AddGuestsThroughExcelFile([FromForm] IFormFile file, int eventId);
    }
}
