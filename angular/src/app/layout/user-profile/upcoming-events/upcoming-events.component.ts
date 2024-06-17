// src/app/upcoming-events/upcoming-events.component.ts
import { Component, OnInit } from '@angular/core';
import { UserEventsService } from '@shared/Services/user-events.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { Event } from '../../../../shared/Models/Event';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FullCalendarModule
  ]
})
export class UpcomingEventsComponent implements OnInit {
  viewDate: Date = new Date();
  attendingEvents: Event[] = [];
  createdEvents: Event[] = [];
  upcomingEvents: Event[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, bootstrap5Plugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    themeSystem: 'bootstrap5',
    events: []
  };
  showCalendarView: boolean = true;
  activeButton: string = 'calendar';

  constructor(private userEvent: UserEventsService, private appSessionService: AppSessionService) {}

  ngOnInit() {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {
    const userId = this.appSessionService.userId;

    this.userEvent.getUpcomingEventsForCurrentUser(userId).subscribe(events => {
      this.attendingEvents = events.map(event => ({ ...event, source: 'attending' }));

      this.userEvent.getUpcomingEventsToAttendForCurrentUser(userId).subscribe(createdEvents => {
        this.createdEvents = createdEvents.map(event => ({ ...event, source: 'upcoming' }));

        // Combine events and set them to calendarOptions.events
        const allEvents = [...this.attendingEvents, ...this.createdEvents];
        this.upcomingEvents = allEvents; // Update the upcomingEvents array

        this.calendarOptions.events = allEvents.map(event => ({
          title: event.name,
          start: event.startDate,
          end: event.endDate,
          color: event.source === 'attending' ? '#3498db' : '#fdbd57'  
        }));
      });
    });
  }

  showCalendar(): void {
    this.showCalendarView = true;
    this.activeButton = 'calendar';
  }

  showDetails(): void {
    this.showCalendarView = false;
    this.activeButton = 'details';
  }

  isSameDate(startDate: string, endDate: string): boolean {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start.toDateString() === end.toDateString();
  }
}
