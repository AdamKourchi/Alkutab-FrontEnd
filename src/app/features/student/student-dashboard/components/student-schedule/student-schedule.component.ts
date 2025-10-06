import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FullCalendarModule,
  FullCalendarComponent,
} from '@fullcalendar/angular'; // Import the FullCalendar component
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Course } from '../../../../../core/models/Course.model';
import { User } from '../../../../../core/models/User.model';
import { AuthService } from '../../../../../core/services/authService.service';
import { PathsService } from '../../../../../core/services/paths.service';
import { ClassSession } from '../../../../../core/models/ClassSession.model';
import { Path } from '../../../../../core/models/Path.model';
import { Level } from '../../../../../core/models/Level.model';
import { ColorService } from '../../../../../core/services/color.service';
import { Circle } from '../../../../../core/models/Circle.model';

@Component({
  selector: 'app-student-schedule',
  imports: [
    MatCardModule,
    FullCalendarModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatDividerModule,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
  ],
  templateUrl: './student-schedule.component.html',
  styleUrl: './student-schedule.component.css',
})
export class StudentScheduleComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent; // Reference to the FullCalendar component

  student!: User;

  calendarOptions!: CalendarOptions;

  loading = true;

  path!: Path;
  sessions: ClassSession[] = [];
  courses: Course[] = [];
  circle!: any;
  groupedCourses: any[] = [];

  private pathsService = inject(PathsService);
  private authService = inject(AuthService);
  private colorService = inject(ColorService);

  allLevelEvents: any[] = [];
  allSessionEvents: any[] = [];
  allCircleEvents: any[] = [];

  allEvents: any[] = [];

  displayedPaths: any[] = [];

  ngOnInit(): void {
    this.initCalendar();
    this.getStudent().then(() => {
      this.loadData().then(() => {
        this.createCalendarEvents(this.path, this.sessions);
      });
    });
  }

  async getStudent() {
    this.student = await this.authService.fetchUser();
    console.log(this.student);
  }

  async loadData() {
    try {
      const [path] = await Promise.all([
        this.pathsService.getStudentCurentPath(this.student.id!),
      ]);

      this.path = path;

      this.courses = path.levels?.flatMap((l) => l.courses ?? []) ?? [];

      this.sessions = this.courses.flatMap((c) => c?.classSessions ?? []);

      this.circle =
        this.student.circle ??
        new Circle(null, '', null, null, [], '', 'offline', null, null);

      this.loading = false;
    } catch (error) {
      console.error('Error loading data:', error);

      this.loading = false;
    }
  }
  initCalendar() {
    const isSmallScreen = window.innerWidth < 640;

    this.calendarOptions = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        multiMonthPlugin,
      ],
      initialView: 'multiMonthYear',
      // slotMinTime: '06:00:00',
      // slotMaxTime: '22:00:00',
      views: {
        multiMonthYear: {
          type: 'multiMonth',
          duration: { months: 12 },
          multiMonthMaxColumns: 2,
        },
      },
      allDayText: 'طوال اليوم',
      allDaySlot: true,
      headerToolbar: isSmallScreen
        ? { left: '', center: 'multiMonthYear,dayGridMonth,timeGridWeek', right: '' } // Hide controls and title on small screens
        : {
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek',
          },
      buttonText: {
        today: 'اليوم',
        month: 'الشهر',
        week: 'الأسبوع',
        multiMonthYear: 'عدة أشهر',
      },
      locale: 'ar',
      events: [],
    };
  }

  createCalendarEvents(path: Path, sessions: any[]) {
    const pathColor = this.colorService.getColorForPath(path.id!);

    const levelsEvents =
      path.levels?.map((level) => {
        const start = level.startAt ? new Date(level.startAt) : null;
        const end = level.endAt ? new Date(level.endAt) : null;

        if (!start || !end) return null;

        end.setDate(end.getDate() + 1); // 👈 Because Allday endDate is exclusif.

        return {
          id: `level-${level.id}`,
          title: `📘 ${level.name} - ${path.name}`,
          start: start.toISOString(),
          end: end.toISOString(),
          allDay: true,
          display: 'block',
          backgroundColor: pathColor,
          borderColor: pathColor,
          extendedProps: {
            isPath: true,
            pathId: path.id,
            levelId: level.id,
            description: level.description,
          },
        };
      }) || [];

    // Create session events

    const sessionEvents = sessions.map((session) => {
      const course = this.courses.find((el) => el.id === session.course_id);
      const pathId = course?.level?.path?.id;
      const courseColor = pathId
        ? this.colorService.getColorForCourse(course.id!, pathId)
        : '#808080';

      console.log(session);

      return {
        id: session.id,
        title: course?.title || '',
        start: session.startTime,
        end: session.endtime,
        backgroundColor: courseColor,
        borderColor: courseColor,
        extendedProps: {
          courseId: session.courseid,
          description: session.description,
          location: session.location,
        },
      };
    });

    console.log('EVEEENTSSS ', this.circle);

    // Create Circle events
    const circleEvents = this.circle
      ? {
          id: this.circle.id,
          daysOfWeek: JSON.parse(this.circle.days_of_week.toString()),
          title: `${this.circle.title} `,
          startTime: this.circle.start_time?.split(' ')[1],
          endTime: this.circle.end_time?.split(' ')[1],
          borderColor: '#1E90FF',
          allDay: false,
          extendedProps: {
            type: 'circle',
            circleId: this.circle.id,
            pathId: this.path.id,
          },
        }
      : [];

    this.allCircleEvents = Array.isArray(circleEvents)
      ? circleEvents
      : [circleEvents];
    this.allLevelEvents = [...levelsEvents];
    this.allSessionEvents = [...sessionEvents];

    this.allEvents = [
      ...this.allLevelEvents,
      ...this.allSessionEvents,
      ...this.allCircleEvents,
    ];

    this.calendarOptions.events = this.allEvents;
  }

  updateCalendarEvents() {
    // Filter level events based on path and level visibility
    const visibleLevels = this.allLevelEvents.filter((event) => {
      const path = this.displayedPaths.find(
        (p) => p.id === event.extendedProps.pathId
      );
      if (!path?.isVisible) return false;

      const level = path.levels?.find(
        (l: Level) => l.id === event.extendedProps.levelId
      );
      return level?.isVisible ?? false;
    });

    // Filter session events based on course's path and level visibility
    const visibleSessions = this.allSessionEvents.filter((event) => {
      const course = this.courses.find(
        (c) => c.id === event.extendedProps.courseId
      );
      if (!course?.level) return false;

      const path = this.displayedPaths.find(
        (p) => p.id === course.level?.path?.id
      );
      if (!path?.isVisible) return false;

      const level = path.levels?.find((l: Level) => l.id === course.level?.id);
      return level?.isVisible ?? false;
    });

    this.allEvents = [...visibleLevels, ...visibleSessions];
    this.calendarOptions.events = this.allEvents;
  }

  getCalendarApi() {
    return this.calendarComponent.getApi();
  }
}
