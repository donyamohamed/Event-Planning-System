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
        [HttpGet]
        public async Task<List<GuestDto>> GetAll()
        {
            return await _guestAppService.GetAllAsync();
        }
        [HttpGet]
        public async Task<GuestDto> GetGuestById(int id)
        {
            return await _guestAppService.GetByIdAsync(id);
        }
        [HttpPost]
        public async Task<GuestDto> Create(Enitities.Guest guest)
        {
            return await _guestAppService.CreateGuest(guest);
        }
        [HttpPut]
        public async Task<GuestDto> Update(int id, Enitities.Guest guest)
        {
            return await _guestAppService.Update(id, guest);    
        }
        [HttpDelete]
        public async Task<GuestDto> Delete(int id)
        {
            return await _guestAppService.Delete(id);
        }

    }
}
