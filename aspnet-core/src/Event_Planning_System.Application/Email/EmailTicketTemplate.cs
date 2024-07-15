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

                body {{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #f5f5f5;
                    font-family: 'PT Sans Narrow', sans-serif;
                    margin: 0;
                    padding: 0;
                    height: 100vh;
                }}

                .ticket {{
                    max-width: 800px;
                    background: #fff;
                    border: 2px solid #ccc;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    display: flex;
                }}

                .ticket-left {{
                    width: 25%;
                    background: #000;
                    color: #fff;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }}

                .ticket-left:before {{
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 10px;
                    height: 100%;
                    background: #fff;
                    border-top-left-radius: 50%;
                    border-bottom-left-radius: 50%;
                }}

                .ticket-left:after {{
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 10px;
                    height: 100%;
                    background: #fff;
                    border-top-right-radius: 50%;
                    border-bottom-right-radius: 50%;
                }}

                .ticket-left .event-name {{
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                }}

                .ticket-left .welcome-message {{
                    font-size: 18px; /* Increased font size */
                    text-align: center;
                    margin-top: 10px; /* Adjust the margin-top as needed */
                    font-weight: bold;
                }}

                .ticket-left .event-date {{
                    background: #f1e4d0;
                    color: #000;
                    padding: 5px 10px;
                    margin-top: 10px; /* Adjust the margin-top as needed */
                    border-radius: 5px;
                    font-size: 16px; /* Increased font size */
                }}

                .ticket-right {{
                    width: 75%;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }}

                .ticket-right .section {{
                    margin-bottom: 10px;
                }}

                .ticket-right .section span {{
                    display: block;
                    font-size: 16px; /* Increased font size */
                }}

                .ticket-right .section .label {{
                    font-weight: bold;
                    margin-bottom: 5px;
                    font-size: 18px; /* Increased font size */
                }}

                .barcode {{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }}

                .barcode img {{
                    height: 50px;
                }}

                .separator {{
                    height: 100%;
                    border-left: 2px dashed #ccc;
                    margin: 0 20px;
                }}

                @media screen and (max-width: 600px) {{
                    .ticket {{
                        flex-direction: column;
                    }}

                    .ticket-left, .ticket-right {{
                        width: 100%;
                    }}
                }}
            </style>
        </head>
        <body>
            <div class='ticket'>
                <div class='ticket-left'>
                    <div class='event-name'>{eventName}</div>
                    <div class='welcome-message'>
                       Welcome, {guestName}!
                    </div>
                    <div class='event-date'>{date:MMMM dd, yyyy}</div>
                </div>
                <div class='separator'></div>
                <div class='ticket-right'>
                    <div class='section'>
                        <span class='label'>Date:</span>
                        <span>{date:MMMM dd, yyyy}</span>
                    </div>
                    <div class='section'>
                        <span class='label'>Time:</span>
                        <span>{date:hh:mm tt}</span>
                    </div>
                    <div class='section'>
                        <span class='label'>Venue:</span>
                        <span>{eventAddress}</span>
                    </div>
                </div>
            </div>
        </body>
        </html>";
    }
}
