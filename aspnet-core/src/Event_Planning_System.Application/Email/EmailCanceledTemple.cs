﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Email
{
    public class EmailCanceledTemple
    {
        public static string GenerateEventCancellationEmail(string eventName, DateTime startDate, string guestName)
        {
            return $@"
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Catamaran:wght@900&family=PT+Sans+Narrow&display=swap');
            *, ::before, ::after {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}
            body {{
                min-height: 100vh;
                display: grid;
                place-items: center;
                background-color: lavender;
                background-size: cover;
                background-position: center;
                font-family: 'PT Sans Narrow', sans-serif;
            }}
            .poster {{
                max-width: 700px;
                width: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                padding: 20px;
                position: relative;
                color: #e9e9e9;
                overflow: hidden;
                text-align: center;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            }}
            .header-img {{
                width: 100%;
                height: 200px;
                border-radius: 10px 10px 0 0;
            }}
            .poster h1 {{
                font-family: 'Catamaran', sans-serif;
                font-size: 2.5rem;
                margin: 20px 0;
            }}
            .poster h2 {{
                font-family: 'Catamaran', sans-serif;
                font-size: 2rem;
                margin-bottom: 20px;
            }}
            .poster .date-time {{
                font-size: 1.25rem;
                margin-bottom: 20px;
            }}
            .poster .date-time span {{
                display: inline-block;
                padding: 10px;
                background-color: rgba(233, 233, 233, 0.3);
                border-radius: 5px;
                margin: 5px;
            }}
            .poster .message {{
                margin-top: 30px;
                font-size: 1.2rem;
                line-height: 1.5;
            }}
            .poster .message p {{
                margin-bottom: 15px;
            }}
            .poster .footer {{
                margin-top: 30px;
                font-size: 1rem;
                color: #cccccc;
            }}
            @media screen and (max-width: 600px) {{
                .poster {{
                    padding: 10px;
                }}
                .poster h1 {{
                    font-size: 2rem;
                }}
                .poster h2 {{
                    font-size: 1.5rem;
                }}
                .poster .date-time {{
                    font-size: 1rem;
                }}
                .poster .message {{
                    font-size: 1rem;
                }}
            }}
        </style>
    </head>
    <body>
        <div class='poster'>
 <img class='header-img' src='https://cmg-cmg-rd-20091-prod.cdn.arcpublishing.com/resizer/HgX8nMzUrr9opXHsnd0xWjgKAQ8=/1440x810/filters:format(jpg):quality(70)/cloudfront-us-east-1.images.arcpublishing.com/cmg/2TDRNGYYPK42B346PJK7WH3ENM.jpg' alt='Header Image'>
            <h1>Event Cancellation</h1>
            <h2>{eventName}</h2>
            <div class='date-time'>
                <span>{startDate:dd MMM yyyy}</span>
            </div>
            <div class='message'>
                <p>Dear {guestName},</p>
                <p>We regret to inform you that the event '{eventName}' scheduled for {startDate:dd MMM yyyy} has been canceled.</p>
                <p>We apologize for any inconvenience this may cause and appreciate your understanding.</p>
                <p>Best regards,</p>
                <p>The Event Planning Team</p>
            </div>
            <div class='footer'>
                <p>&copy; {DateTime.Now.Year} Event Planning Team. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>";
        }


    }
}
