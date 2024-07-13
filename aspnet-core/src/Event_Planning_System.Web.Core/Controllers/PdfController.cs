using Microsoft.AspNetCore.Mvc;
using DinkToPdf;
using DinkToPdf.Contracts;
using Event_Planning_System.Email;
using System;

namespace YourNamespace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        private readonly IConverter _converter;

        public PdfController(IConverter converter)
        {
            _converter = converter;
        }

        [HttpGet("DownloadInvitation")]
        public IActionResult DownloadInvitation(string eventName, DateTime date, string eventAddress, string eventImg)
        {
            try
            {
                // Log received parameters
                Console.WriteLine($"DownloadInvitation called with eventName={eventName}, date={date}, eventAddress={eventAddress}, eventImg={eventImg}");

                // Validate parameters
                if (string.IsNullOrEmpty(eventName) || string.IsNullOrEmpty(eventAddress) || string.IsNullOrEmpty(eventImg))
                {
                    throw new ArgumentException("Invalid parameters.");
                }

                // Generate HTML content
                string htmlContent = EmailTemplate.GetInvitationEmail(eventName, date, eventAddress, eventImg, string.Empty);

                // Create PDF document
                var pdf = new HtmlToPdfDocument()
                {
                    GlobalSettings = {
                        PaperSize = PaperKind.A4,
                        Orientation = Orientation.Portrait
                    },
                    Objects = {
                        new ObjectSettings() {
                            HtmlContent = htmlContent,
                            WebSettings = { DefaultEncoding = "utf-8" }
                        }
                    }
                };

                // Convert HTML to PDF
                byte[] pdfBytes = _converter.Convert(pdf);

                // Return PDF file
                return File(pdfBytes, "application/pdf", "Invitation.pdf");
            }
            catch (Exception ex)
            {
                // Log exception
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
