import { Component, OnInit } from '@angular/core';
import { UserEventsService } from '@shared/Services/user-events.service';
import {AppSessionService} from '@shared/session/app-session.service'
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
  upcomingEvents: Event[] = [];
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, bootstrap5Plugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    eventColor: '#b9ecab',
    themeSystem: 'bootstrap5',
    events: []
  };
  showCalendarView: boolean = true;
  activeButton: string = 'calendar';

  constructor(private userEvent: UserEventsService,  private appSessionService: AppSessionService) {}

  ngOnInit() {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {
    // const userId = 1;
    const userId = this.appSessionService.userId;

    this.userEvent.getUpcomingEventsForCurrentUser(userId).subscribe(events => {
      this.upcomingEvents = events;
      console.log(events)
      console.log(events[0].startDate)

      // this.calendarOptions = {
      //   ...this.calendarOptions,
      //   events: events.map(event => ({
      //     title: event.name,
      //     start: event.startDate,
      //     end: event.endDate,
      //     display: 'background'
      //   }))
      // };
      this.calendarOptions.events = events.map(event => ({
        title: event.name,
        start: event.startDate,
        end: event.endDate,
      }));
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
