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
                    background-color: lavender;
                    background-image: url('{backgroundImage}');
                    background-size: cover;
                    background-position: center;
                    font-family: 'PT Sans Narrow', sans-serif;
                }}

                .ticket {{
                    max-width: 700px;
                    width: 100%;
                    background-color: #ffffff;
                    padding: 20px;
                    position: relative;
                    color: #333333;
                    overflow: hidden;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                    text-align: center;
                }}

                .header-img {{
                    width: 100%;
                    height: 150px;
                    border-radius: 10px 10px 0 0;
                }}

                .ticket h1 {{
                    font-family: 'Catamaran', sans-serif;
                    font-size: 2rem;
                    margin: 20px 0;
                }}

                .ticket h2 {{
                    font-family: 'Catamaran', sans-serif;
                    font-size: 1.5rem;
                    margin-bottom: 20px;
                }}

                .ticket .welcome {{
                    font-size: 1.25rem;
                    margin-bottom: 20px;
                    color: #555555;
                }}

                .ticket .date-time {{
                    font-size: 1rem;
                    margin-bottom: 20px;
                }}

                .ticket .date-time span {{
                    display: inline-block;
                    padding: 5px 10px;
                    background-color: #f1f1f1;
                    border-radius: 5px;
                    margin: 2px;
                }}

                .ticket .venue {{
                    margin-top: 20px;
                }}

                .ticket .venue h3 {{
                    font-size: 1.5rem;
                }}

                .ticket .venue p {{
                    font-size: 1rem;
                }}

                .ticket .details {{
                    margin-top: 30px;
                    font-size: 1rem;
                }}

                .ticket .details p {{
                    margin-bottom: 10px;
                }}

                .ticket .footer {{
                    margin-top: 30px;
                    font-size: 0.9rem;
                    color: #777777;
                }}

                .download-btn {{
                    display: inline-block;
                    margin-top: 20px;
                    padding: 8px 18px;
                    font-size: 1rem;
                    color: white;
                    background-color: #ff5722;
                    text-decoration: none;
                    border-radius: 5px;
                    cursor: pointer;
                }}

                @media screen and (max-width: 600px) {{
                    .ticket {{
                        padding: 10px;
                    }}

                    .ticket h1 {{
                        font-size: 1.5rem;
                    }}

                    .ticket h2 {{
                        font-size: 1.25rem;
                    }}

                    .ticket .date-time {{
                        font-size: 0.875rem;
                    }}

                    .ticket .venue h3 {{
                        font-size: 1.25rem;
                    }}

                    .ticket .venue p {{
                        font-size: 0.875rem;
                    }}

                    .ticket .details {{
                        font-size: 0.875rem;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class='ticket' id='ticket'>
                <img class='header-img' src='{backgroundImage}' alt='Event Image'>
                <h1>{eventName}</h1>
                <h2>Ticket</h2>
                <div class='welcome'>
                    Welcome, {guestName}! We're thrilled to have you join us for this event.
                </div>
                <div class='date-time'>
                    <span>{date:HH:mm}</span>
                    <span>{date:dd}</span>
                    <span>{date:MMM}</span>
                    <span>{date:yyyy}</span>
                </div>
                <div class='venue'>
                    <h3>Event Location</h3>
                    <p>{eventAddress}</p>
                    <p><small>www.eventlocation.com</small></p>
                </div>
                //<div class='details'>
                //    <p><strong>Guest Name:</strong> {guestName}</p>
                //</div>
                <div class='footer'>
                    <p>&copy; {DateTime.Now.Year} Event Planning Team. All rights reserved.</p>
                </div>
                //<form method='post' action='/api/Pdf/DownloadInvitation'>
                //    <input type='hidden' name='eventName' value='{eventName}' />
                //    <input type='hidden' name='date' value='{date:yyyy-MM-ddTHH:mm:ss}' />
                //    <input type='hidden' name='eventAddress' value='{eventAddress}' />
                //    <input type='hidden' name='eventImg' value='{eventImg}' />
                //    <button type='submit' class='download-btn'>Print Ticket</button>
                //</form>

            </div>
        </body>
        </html>";
    }
}
