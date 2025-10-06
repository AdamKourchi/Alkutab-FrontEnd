import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-course-scheduler',
  imports: [FullCalendarModule, CommonModule,],
  templateUrl: './course-scheduler.component.html',
  styleUrl: './course-scheduler.component.css'
})
export class CourseSchedulerComponent {

  @Input() selectedCourse: any; // course object with path, level, teacher, etc.

  calendarOptions!: CalendarOptions;

  ngOnInit(): void {
    this.initCalendar();
  }

  initCalendar() {
    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
      initialView: 'timeGridWeek',
      editable: true,
      selectable: true,
      select: this.handleSelect.bind(this),
      events: [], // this will be populated dynamically
      eventClick: this.handleEventClick.bind(this),
      eventDrop: this.handleEventChange.bind(this),
      eventResize: this.handleEventChange.bind(this),
      locale: 'ar', 
    };
  }

  handleSelect(arg: any) {
    // open dialog to create single or recurring session
    console.log('Selected range:', arg.startStr, arg.endStr);
  }

  handleEventClick(info: any) {
    // optionally edit/delete session
    console.log('Clicked event:', info.event);
  }

  handleEventChange(info: any) {
    // update backend after move/resize
    console.log('Event changed:', info.event);
  }
}
