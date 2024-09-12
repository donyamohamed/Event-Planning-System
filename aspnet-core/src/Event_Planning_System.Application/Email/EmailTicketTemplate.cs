using System;

public class EmailTicketTemplate
{
    public static string SendEventTicket(string eventName, DateTime date, string eventAddress, string guestName, string eventImg)
    {
        string backgroundImage = string.IsNullOrEmpty(eventImg)
             ? "https://cdn.pixabay.com/photo/2016/12/18/00/47/structure-1914730_960_720.jpg"
             : eventImg;

        return $@"
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
                        background-color: #050794;
                        
                        background-size: cover;
                        background-position: center;
                        font-family: 'PT Sans Narrow', sans-serif;
                    }}

                    .poster {{
                        max-width: 700px;
                        width: 100%;
                        background-color: #050794 ;
                        padding: 20px;
                        position: relative;
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
                        background-color:  #fbaf1b;
                        padding:10px 10px;
                        color:#050794;
                        
                    }}

                    .poster h2 {{
                        font-family: 'Catamaran', sans-serif;
                        font-size: 2rem;
                        margin-bottom: 20px;
                        color:#fbaf1b;
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

                    .poster .venue {{
                        margin-top: 20px;
                    }}

                    .poster .venue h3 {{
                        font-size: 1.75rem;
                         color:#fbaf1b;
                    }}

                    .poster .venue p {{
                        font-size: 1.25rem;
                        color:white;
                    }}

                    .poster .message {{
                        margin-top: 30px;
                        font-size: 1.2rem;
                        line-height: 1.5;
                        color:white;
                    }}

                    .poster .message p {{
                        margin-bottom: 15px;
                    }}

                    .poster .footer {{
                        margin-top: 30px;
                        font-size: 1rem;
                        color: white;
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
                        cursor: pointer;
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

                        .poster .venue h3 {{
                            font-size: 1.5rem;
                        }}

                        .poster .venue p {{
                            font-size: 1rem;
                        }}

                        .poster .message {{
                            font-size: 1rem;
                        }}
                    }}
                </style>
            </head>
            <body>
                <div class='poster' id='poster'>
                    <img class='header-img' src='{backgroundImage}' alt='Header Image'>
                    <h1>Eventa Ticket</h1>
                    <h2>{eventName}</h2>
                    <div class='date-time'>
                        <span>{date:HH:mm}</span>
                        <span>{date:dd}</span>
                        <span>{date:MMM}</span>
                        <span>{date:yyyy}</span>
                    </div>
                    <div class='venue'>
                        <p>Event Location:{eventAddress}</p>
                        
                    </div>
                    <div class='message'>
                         <p>Welcome to the {eventName} event! We are thrilled to have you with us.😍❤</p>
                    </div>
                    <div class='footer'>
                        <p>&copy; {DateTime.Now.Year} Event Planning Team. All rights reserved.</p>
                    </div>
                   
                </div>
               
            </body>
            </html>";
    }
}
