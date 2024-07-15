﻿using Event_Planning_System.Payment.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Payment
{
    public interface IPaymentAppService 
    {
        Task<IActionResult> CreateCheckoutSession([FromBody] PaymentDto paymentDto);
    }
}
