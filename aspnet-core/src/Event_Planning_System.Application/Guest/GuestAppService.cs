using Abp.Application.Services;
using Abp.Domain.Repositories;
using AutoMapper;
using Event_Planning_System.Authorization.Users;
using Event_Planning_System.Enitities;
using Event_Planning_System.Guest.Dto;
using Event_Planning_System.UserProfile;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Guest
{
    public class GuestAppService : ApplicationService, IGuestAppService // AsyncCrudAppService<Enitities.Guest, GuestDto, long>,
    {
        private readonly IRepository<Enitities.Guest, long> _repository;
        private readonly IMapper _mapper;   
        public GuestAppService(IRepository<Enitities.Guest,long> repository, IMapper mapper)//:base(repository)
        {
            _repository=repository;
            _mapper=mapper;
        }
        [HttpGet]
        public async Task<List<GuestDto>> GetAllAsync()
        {
            
            var guests = await _repository.GetAllListAsync();
            return _mapper.Map<List<GuestDto>>(guests);
        }
        [HttpGet]
        public async Task<GuestDto> GetByIdAsync(int id)
        {
            var guest = await _repository.GetAsync(id);
            return _mapper.Map<GuestDto>(guest);
        }
        [HttpPost]
        public async Task<GuestDto> CreateGuest(Enitities.Guest guest)
        {
            var obj= await _repository.InsertAsync(guest);
            CurrentUnitOfWork.SaveChangesAsync();
            return _mapper.Map<GuestDto>(obj);
        }
        [HttpDelete]
        public async Task<GuestDto> Delete(int id)
        {
            var guest = await _repository.GetAsync(id);
           
                var deleteObj = _repository.DeleteAsync(guest);
                CurrentUnitOfWork.SaveChangesAsync();
                return _mapper.Map<GuestDto>(deleteObj);
            
        }
        [HttpPut]
        public async Task<GuestDto> Update(int id, Enitities.Guest guest)
        {
            var obj = await _repository.GetAsync(id);
            obj.InvitationState = guest.InvitationState;
            obj.Email = guest.Email;
            obj.Name = guest.Name;
            obj.Phone = guest.Phone;
            CurrentUnitOfWork.SaveChangesAsync();
            return _mapper.Map<GuestDto>(obj);
        }
    }
}
