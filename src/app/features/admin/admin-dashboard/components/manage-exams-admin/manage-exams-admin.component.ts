import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FullCalendarModule,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import rrulePlugin from '@fullcalendar/rrule';

import { MatCardModule } from '@angular/material/card';
import { CoursesService } from '../../../../../core/services/courses.service';
import { Course } from '../../../../../core/models/Course.model';
import { SessionService } from '../../../../../core/services/sessions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { PathsService } from '../../../../../core/services/paths.service';
import { Path } from '../../../../../core/models/Path.model';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleSessionDialogComponent } from '../schedule-session-dialog/schedule-session-dialog.component';
import { Level } from '../../../../../core/models/Level.model';
import { ClassSession } from '../../../../../core/models/ClassSession.model';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ColorService } from '../../../../../core/services/color.service';
import { Exam } from '../../../../../core/models/Exam.model';
import { ExamsService } from '../../../../../core/services/exams.service';
import { ViewExamDialog } from '../../../../../shared/view-exam-dialog/view-exam-dialog.component';
import { Circle } from '../../../../../core/models/Circle.model';

@Component({
  selector: 'app-manage-exams-admin-component',
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
    MatCheckboxModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './manage-exams-admin.component.html',
  styleUrl: './manage-exams-admin.component.css',
})
export class ManageExamsAdminComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('external')
  external!: ElementRef;

  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);

  calendarOptions!: CalendarOptions;
  loading = true;

  private coursesService = inject(CoursesService);
  private sessionsService = inject(SessionService);
  private pathsService = inject(PathsService);
  private colorService = inject(ColorService);
  private examsService = inject(ExamsService);

  courses: Course[] = [];
  paths: Path[] = [];
  sessions: ClassSession[] = [];
  exams: Exam[] = [];

  allLevelEvents: any[] = [];
  allSessionEvents: any[] = [];
  allCircleEvents: any[] = [];

  allEvents: any[] = [];

  displayedPaths: any[] = [];

  ngOnInit(): void {
    this.initCalendar();
    this.loadData().then(() => {
      this.createCalendarEvents(this.displayedPaths, this.sessions);
    });
  }

  async loadData() {
    try {
      const [paths, courses, exams] = await Promise.all([
        this.pathsService.getAllPaths(),
        this.coursesService.getAll(),
        this.examsService.getAllExams(),
      ]);

      this.paths = paths;
      this.courses = courses;
      this.exams = exams;

      this.displayedPaths = paths.map((p) => {
        return {
          ... p,
          isVisible: true,
          levels: p.levels?.map((l) => ({ ...l, isVisible: true })),
          circles: p.circles?.map((c) => ({ ...c, isVisible: true })),
        };
      });

      const sessions = await this.sessionsService.getSessions();

      this.sessions = sessions;

      this.loading = false;
    } catch (error) {
      console.error('Error loading data:', error);
      this._snackBar.open('حدث خطأ أثناء تحميل البيانات', 'إغلاق', {
        duration: 3000,
        direction: 'rtl',
      });
      this.loading = false;
    }
  }

  viewExam(exam: Exam) {
    this._dialog.open(ViewExamDialog, {
      width: '80%',
      maxHeight: '90vh',
      data: { exam },
    });
  }

  initCalendar() {
    this.calendarOptions = {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        multiMonthPlugin,
        rrulePlugin,
      ],
      initialView: 'multiMonthYear',
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
      eventDidMount: (arg) => {
        arg.el.addEventListener('contextmenu', (event) => {
          event.preventDefault();
          this.confirmDeleteEvent(arg.event);
        });
      },
      editable: true,
      selectable: true,
      eventClick: this.handleEventClick.bind(this),
      select: this.handleSelect.bind(this),
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
      const courseColor = pathId
        ? this.colorService.getColorForCourse(course.id!, pathId)
        : '#808080';

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

    // Create exam events
    const examEvents = this.exams
      .filter((exam) => exam.status === 'dated' && exam.startTime)
      .map((exam) => {
        return {
          id: exam.id,
          title: `📝 ${exam.title} - ${exam.course?.title}`,
          start: exam.startTime,
          end: exam.endTime,
          backgroundColor: '#FF5722',
          borderColor: '#FF5722',
          allDay: false,
          extendedProps: {
            type: 'exam',
            examId: exam.id,
            courseId: exam.course?.id,
            description: exam.description,
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

    this.allLevelEvents = [...levelsEvents];
    this.allSessionEvents = [...sessionEvents];
    this.allCircleEvents = [...circleEvents];
    this.allEvents = [
      ...this.allLevelEvents,
      ...this.allSessionEvents,
      ...this.allCircleEvents,
      ...examEvents,
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

  confirmDeleteEvent(event: EventApi) {
    const isPath = event.extendedProps?.['isPath'];
    if (isPath) {
      this._snackBar.open('لا يمكن حذف المسارات من هنا', 'إغلاق', {
        duration: 3000,
        direction: 'rtl',
      });
      return;
    }

    const confirmDelete = confirm('هل تريد حذف هذه الحصة؟');
    if (confirmDelete) {
      this.deleteEvent(event);
    }
  }

  handleEventClick(info: any) {
    // Don't edit path events
    if (info.event.extendedProps?.isPath) {
      this._snackBar.open('لا يمكن تعديل المسارات من هنا', 'إغلاق', {
        duration: 3000,
        direction: 'rtl',
      });
      return;
    }

    // Open the edit dialog
    this.openSessionDialog({ event: info.event });
  }

  handleSelect(arg: any) {
    this.openSessionDialog({
      start: arg.start,
      end: arg.end,
      courses: this.courses,
    });
  }

  handleEventReceive(eventInfo: any) {
    try {
      console.log('Data Received', eventInfo.event);

      const event = eventInfo.event;
      const dataEvent = eventInfo.draggedEl.getAttribute('data-event');

      console.log('Data Event', dataEvent);

      let data;

      try {
        data = JSON.parse(dataEvent);
      } catch (parseError) {
        console.error('Error parsing data-event:', parseError);
        return;
      }

      console.log('Parsed data:', data);

      if (data.type === 'exam') {
        const exam = this.exams.find((e) => e.id === data.examId);
        if (exam) {
          // Set duration based on exam duration
          const endDate = new Date(event.start);
          endDate.setMinutes(endDate.getMinutes() + (data.duration || 120));
          event.setEnd(endDate);

          // Update exam in backend
          const updatedExam = new Exam(
            exam.id,
            exam.course,
            exam.examType,
            exam.title,
            exam.description,
            exam.isFinal,
            exam.duration,
            exam.instructions,
            exam.status,
            event.start,
            event.end,
            exam.questions
          );

          this.examsService
            .updateExam(updatedExam)
            .then(() => {
              this._snackBar.open('تم تحديث موعد الاختبار بنجاح', 'إغلاق', {
                duration: 3000,
                direction: 'rtl',
              });
            })
            .catch((error) => {
              console.error('Error updating exam:', error);
              this._snackBar.open(
                'حدث خطأ أثناء تحديث موعد الاختبار',
                'إغلاق',
                {
                  duration: 3000,
                  direction: 'rtl',
                }
              );
            });
        }
      }
    } catch (error) {
      console.error('Error in handleEventReceive:', error);
      this._snackBar.open('حدث خطأ أثناء معالجة السحب والإفلات', 'إغلاق', {
        duration: 3000,
        direction: 'rtl',
      });
    }
  }

  getCourses() {
    this.coursesService
      .getAll()
      .then((data) => {
        this.courses = [...data];
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }

  openSessionDialog(data: any) {
    const dialogRef = this._dialog.open(ScheduleSessionDialogComponent, {
      width: '600px',
      data: {
        ...data,
        courses: this.courses,
      },
      direction: 'rtl',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      const calendarApi = this.getCalendarApi();

      if (!calendarApi) {
        console.error('Calendar API is not available');
        return;
      }

      if (data.event) {
        // Update existing event
        data.event.remove(); // Remove the old event
      }

      // Add the new event to the calendar
      calendarApi.addEvent(result);

      // Save to backend
      this.sessionsService
        .saveCalendarEvents(calendarApi)
        .then(() => {
          this._snackBar.open('تم حفظ الحصة بنجاح', 'إغلاق', {
            duration: 3000,
            direction: 'rtl',
          });
        })
        .catch((error) => {
          console.error('Error saving session:', error);
          this._snackBar.open('حدث خطأ أثناء حفظ الحصة', 'إغلاق', {
            duration: 3000,
            direction: 'rtl',
          });
        });
    });
  }

  deleteEvent(event: EventApi) {
    // Remove from UI first
    event.remove();

    // If it has an ID, remove from backend too
    if (event.id) {
      this.sessionsService
        .deleteSession(event.id)
        .then(() => {
          this._snackBar.open('تم حذف الحصة بنجاح', 'إغلاق', {
            duration: 3000,
            direction: 'rtl',
          });
        })
        .catch((error) => {
          console.error('Error deleting session:', error);
          this._snackBar.open('حدث خطأ أثناء حذف الحصة', 'إغلاق', {
            duration: 3000,
            direction: 'rtl',
          });
        });
    }
  }

  getCalendarApi() {
    return this.calendarComponent.getApi();
  }

  saveCalendarEvents() {
    const calendarApi = this.getCalendarApi();
    if (!calendarApi) {
      console.error('Calendar API is not available');
      return;
    }

    this.sessionsService
      .saveCalendarEvents(calendarApi)
      .then(() => {
        console.log('Successfully saved calendar events');
        this._snackBar.open('تم حفظ الحصص بنجاح', 'إغلاق', {
          duration: 3000,
          direction: 'rtl',
          panelClass: ['custom-snackbar'],
        });
      })
      .catch((error) => {
        console.error('Error saving calendar events:', error);
      });
  }
}
