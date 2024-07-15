using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Mvc;
using System;

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
        // Example logic using DinkToPdf to generate PDF bytes
        var pdfBytes = GenerateInvitationPdf(eventName, date, eventAddress, eventImg);

        if (pdfBytes == null)
        {
            return NotFound();
        }

        // Return the PDF file
        return File(pdfBytes, "application/pdf", "Invitation.pdf");
    }

    private byte[] GenerateInvitationPdf(string eventName, DateTime date, string eventAddress, string eventImg)
    {
        // Example logic using DinkToPdf or any PDF generation library
        var htmlContent = $"<html><body><h1>{eventName}</h1><p>Date: {date}</p><p>Address: {eventAddress}</p></body></html>";

        var converter = new BasicConverter(new PdfTools());
        var doc = new HtmlToPdfDocument()
        {
            GlobalSettings = {
            ColorMode = ColorMode.Color,
            Orientation = Orientation.Portrait,
            PaperSize = PaperKind.A4,
        },
            Objects = {
            new ObjectSettings() {
                HtmlContent = htmlContent,
            }
        }
        };

        byte[] pdfBytes = converter.Convert(doc);
        return pdfBytes;
    }

}
