﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.SMS
{
    public class SmsRequest
    {
        public string ToPhoneNumber { get; set; }
        public string Message { get; set; }
    }
}