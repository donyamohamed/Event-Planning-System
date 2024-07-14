using AutoMapper;
using Event_Planning_System.Payment.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Payment.Mapping
{
    public class PaymentMappingProfile : Profile
    {
        public PaymentMappingProfile()
        {
            CreateMap<Entities.Payment, PaymentDto>();
            CreateMap<PaymentDto, Entities.Payment>();
        }
    }
}
