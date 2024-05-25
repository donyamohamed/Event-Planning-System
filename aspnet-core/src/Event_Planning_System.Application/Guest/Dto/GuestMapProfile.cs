using Abp.AutoMapper;
using AutoMapper;
using Event_Planning_System.Authorization.Roles;
using Event_Planning_System.Enitities;
using Event_Planning_System.Roles.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Guest.Dto
{
    public class GuestMapProfile : Profile
    {
        public GuestMapProfile()
        {
            CreateMap<GuestDto,Enitities.Guest>();
            CreateMap<Enitities.Guest, GuestDto>();
        }
    }
}
