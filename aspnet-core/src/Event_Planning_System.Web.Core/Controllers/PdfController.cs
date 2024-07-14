using DinkToPdf.Contracts;
using Event_Planning_System.Email;
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
        // Logic to generate PDF based on eventName, date, eventAddress, eventImg
        // Example logic using DinkToPdf
        var pdfBytes = GenerateInvitationPdf(eventName, date, eventAddress, eventImg);

        if (pdfBytes == null)
        {
            return NotFound();
        }

        // Return the PDF file
        return File(pdfBytes, "application/pdf", "Invitation.pdf");
    }

    [HttpPost("DownloadInvitation")]
    public IActionResult DownloadInvitation([FromBody] EmailRequest emailRequest)
    {
        // Ensure your logic for generating PDF from emailRequest data
        var pdfBytes = GenerateInvitationPdf(emailRequest.EventName, emailRequest.Date, emailRequest.EventAddress, emailRequest.EventImage);

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
        // Generate PDF bytes here
        byte[] pdfBytes = null; // Replace with actual PDF generation logic
        return pdfBytes;
    }
}
