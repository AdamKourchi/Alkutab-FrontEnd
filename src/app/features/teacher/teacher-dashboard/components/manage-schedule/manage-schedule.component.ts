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
import { SessionService } from '../../../../../core/services/sessions.service';
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
import { CoursesTeacherService } from '../../../../../core/services/teacher-courses.service';
import { ColorService } from '../../../../../core/services/color.service';
import { Circle } from '../../../../../core/models/Circle.model';

@Component({
  selector: 'app-manage-schedule',
  standalone: true,
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
  templateUrl: './manage-schedule.component.html',
  styleUrl: './manage-schedule.component.css',
})
export class ManageScheduleComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent; // Reference to the FullCalendar component


  calendarOptions!: CalendarOptions;
  loading = true;

  private coursesService = inject(CoursesTeacherService);
  private sessionsService = inject(SessionService);
  private pathsService = inject(PathsService);
  private authService = inject(AuthService);
  private colorService = inject(ColorService);

  courses: Course[] = [];
  paths: Path[] = [];
  sessions: ClassSession[] = [];

  allLevelEvents: any[] = [];
  allSessionEvents: any[] = [];
    allCircleEvents: any[] = [];

  teacher! : User;

  allEvents: any[] = [];

  displayedPaths: any[] = [];

  ngOnInit(): void {
    this.initCalendar();
    this.getTeacher().then(() => {
    this.loadData().then(() => {
        this.createCalendarEvents(this.displayedPaths, this.sessions);
      });
    });
  }

  async getTeacher() {
    this.teacher = await this.authService.fetchUser();
  }

  async loadData() {
    try {
      const [paths, courses] = await Promise.all([
        this.pathsService.getAllPathsOfTeacher(this.teacher.id!),
        this.coursesService.getAllCourses(this.teacher.id!),
      ]);

      this.paths = paths;      
      this.courses = courses;

      this.displayedPaths = paths.map((p) => {
        return {
          ...p,
          isVisible: true,
          levels: p.levels?.map((l) => ({ ...l, isVisible: true })),
          circles: p.circles?.map((c) => ({ ...c, isVisible: true })),
        };
      });

      const sessions = await this.sessionsService.getSessionByTeacherId( this.teacher.id!);

      this.sessions = sessions;

      this.loading = false;
    } catch (error) {
      console.error('Error loading data:', error);
    
      this.loading = false;
    }
  }

  initCalendar() {
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
      headerToolbar: {
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

  createCalendarEvents(paths: Path[], sessions: any[]) {

    const levelsEvents = paths.flatMap((p, index) => {
      const pathColor = this.colorService.getColorForPath(p.id!);

      return (
        p.levels?.map((level) => {
          const start = level.startAt ? new Date(level.startAt) : null;
          const end = level.endAt ? new Date(level.endAt) : null;

          if (!start || !end) return null;

          end.setDate(end.getDate() + 1); // 👈 Because Allday endDate is exclusif.

          return {
            id: `level-${level.id}`,
            title: `📘 ${level.name} - ${p.name}`,
            start: start.toISOString(),
            end: end.toISOString(),
            allDay: true,
            display: 'block',
            backgroundColor: pathColor,
            borderColor: pathColor,
            extendedProps: {
              isPath: true,
              pathId: p.id,
              levelId: level.id,
              description: level.description,
            },
          };
        }) || []
      );
    });

    // Create session events
    const sessionEvents = sessions.map((session) => {
      const course = this.courses.find((el) => el.id === session.course_id);
      const pathId = course?.level?.path?.id;
      const courseColor = pathId ? this.colorService.getColorForCourse(course.id!, pathId) : '#808080';

      return {
        id: session.id,
        title: course?.title || '',
        start: session.start_time,
        end: session.end_time,
        backgroundColor: courseColor,
        borderColor: courseColor,
        extendedProps: {
          courseId: session.course_id,
          description: session.description,
          location: session.location,
        },
      };
    });

        // Create Circles events
    const circleEvents = paths.flatMap((p, index) => {
      return (
        p.circles?.map((circle) => {
          return {
            id: circle.id,
            daysOfWeek: JSON.parse(circle.daysOfWeek.toString()),
            title: `${circle.title} `,
            startTime: circle.startTime?.split(' ')[1], 
            endTime: circle.endTime?.split(' ')[1], 
            borderColor: '#1E90FF',
            allDay: false,
            extendedProps: {
              type: 'circle',
              circleId: circle.id,
              pathId: p.id,
            },
          };
        }) || []
      );
    });

    
    this.allCircleEvents = [...circleEvents];
    this.allLevelEvents = [...levelsEvents];
    this.allSessionEvents = [...sessionEvents];

    this.allEvents = [...this.allLevelEvents, ...this.allSessionEvents, ...this.allCircleEvents];

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

        //Circles event visibility
        const visibleCircles = this.allCircleEvents.filter((event) => {
    
    
          const path = this.displayedPaths.find(
            (p) => p.id === event.extendedProps.pathId
          );
    
          if (!path?.isVisible) return false;
    
             const circle = path.circles?.find(
            (c: Circle) => c.id === event.extendedProps.circleId
          );
          return circle?.isVisible ?? false;
    
           });

    this.allEvents = [...visibleLevels, ...visibleSessions, ...visibleCircles];
    this.calendarOptions.events = this.allEvents;
  }

  getCalendarApi() {
    return this.calendarComponent.getApi();
  }
}
