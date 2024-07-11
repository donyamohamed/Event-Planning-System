using Castle.Facilities.TypedFactory.Internal;
using System;

namespace Event_Planning_System.Email
{
    public class EmailTemplate
    {
        public static string GetInvitationEmail(string eventName, DateTime date, string eventAddress, string eventImg, string downloadUrl)
        {
            string backgroundImage = string.IsNullOrEmpty(eventImg)
                ? "https://cdn.pixabay.com/photo/2016/12/18/00/47/structure-1914730_960_720.jpg"
                : eventImg;

            string htmlContent = $@"
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Catamaran:wght@900&family=PT+Sans+Narrow&display=swap');

            *,
            ::before,
            ::after {{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }}

            body {{
                min-height: 100vh;
                display: grid;
                place-items: center;
                background-color: lavender;
                background-image: url('{backgroundImage}');
                background-size: cover;
                background-position: center;
                font-family: 'PT Sans Narrow', sans-serif;
            }}

            .poster {{
                max-width: 700px;
                width: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                position: relative;
                color: #e9e9e9;
                overflow: hidden;
                
                text-align: center;
            }}

            .header-img {{
                width: 100%;
                height: 200px;
            }}

            .poster h1 {{
                font-family: 'Catamaran', sans-serif;
                font-size: 3rem;
                margin-bottom: 10px;
            }}

            .poster h2 {{
                font-family: 'Catamaran', sans-serif;
                font-size: 2rem;
                margin-bottom: 20px;
            }}

            .poster .date-time {{
                font-size: 1.5rem;
                margin-bottom: 20px;
            }}

            .poster .date-time span {{
                display: inline-block;
                padding: 10px;
                background-color: rgba(233, 233, 233, 0.3);
                border-radius: 5px;
                margin: 5px;
            }}

            .poster .venue {{
                margin-top: 20px;
            }}

            .poster .venue h3 {{
                font-size: 1.75rem;
            }}

            .poster .venue p {{
                font-size: 1.25rem;
            }}

            @media screen and (max-width: 600px) {{
                .poster {{
                    height: auto;
                }}

                .poster h1 {{
                    font-size: 2.5rem;
                }}

                .poster h2 {{
                    font-size: 1.75rem;
                }}

                .poster .date-time {{
                    font-size: 1.25rem;
                }}

                .poster .venue h3 {{
                    font-size: 1.5rem;
                }}

                .poster .venue p {{
                    font-size: 1rem;
                }}
            }}

            .download-btn {{
                display: inline-block;
                margin-top: 20px;
                padding: 8px 18px;
                font-size: 1rem;
                color: white;
                background-color: #fbaf1b;
                text-decoration: none;
                border-radius: 5px;
            }}
        </style>
    </head>
    <body>
        <div class='poster'>
            <img class='header-img' src='{backgroundImage}' alt='Header Image'>
            <h1>Event Invitation</h1>
            <h2>{eventName}</h2>
            <div class='date-time'>
                <span>{date:HH:mm}</span>
                <span>{date:dd}</span>
                <span>{date:MMM}</span>
                <span>{date:yyyy}</span>
            </div>
            <div class='venue'>
                <h3>Event Location</h3>
                <p>{eventAddress}</p>
            </div>
            <a href='{downloadUrl}' class='download-btn'>Download Invitation</a>
        </div>
    </body>
    </html>";

            return htmlContent;
        }
    }
    }