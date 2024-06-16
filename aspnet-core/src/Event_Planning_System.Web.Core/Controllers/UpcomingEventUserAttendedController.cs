using Abp.AspNetCore.Mvc.Controllers;
using Event_Planning_System.Event;
using Event_Planning_System.Notification;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class UpcomingEventUserAttendedController : AbpController
{
    private readonly INotificationAppService _notificationService;
    private readonly IEventAppService _eventService;

    public UpcomingEventUserAttendedController(INotificationAppService notificationService, IEventAppService eventService)
    {
        _notificationService = notificationService;
        _eventService = eventService;
    }

    [HttpGet("GetUserAcceptedUpcomingEvents")]
    public async Task<IActionResult> GetUserAcceptedUpcomingEvents(int userId)
    {
        // Fetch all notifications
        var notifications = await _notificationService.GetAllNotifications();

        // Filter notifications for the current user with status 'Accepted'
        var filteredNotifications = notifications
            .Where(n => n.GuestId == userId && n.status == Notification_Status.Accepted) // Use appropriate status enum or value
            .ToList();

        // Extract event IDs from filtered notifications
        var eventIds = filteredNotifications.Select(n => n.EventId).Distinct().ToList();

        // Fetch events based on the event IDs
        var events = await _eventService.GetEventsByIds(eventIds);

        // Filter for upcoming events
        var upcomingEvents = events.Where(e => e.StartDate > DateTime.Now).ToList();

        return Ok(upcomingEvents);
    }
}
