import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { Course } from '../../../../../core/models/Course.model';
import { Level } from '../../../../../core/models/Level.model';
import { ColorService } from '../../../../../core/services/color.service';
import { Exam } from '../../../../../core/models/Exam.model';
import { ExamsService } from '../../../../../core/services/exams.service';

@Component({
  selector: 'app-schedule-session-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
  ],
  templateUrl: './schedule-session-dialog.component.html',
  styleUrls: ['./schedule-session-dialog.component.css'],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ar' },
  ],
})
export class ScheduleSessionDialogComponent implements OnInit {
  sessionForm!: FormGroup;
  examForm!: FormGroup;
  selectedCourseLevel: Level | null = null;
  courses: Course[] = [];
  exams: Exam[] = [];
  isEditMode = false;
  selectedTabIndex = 0;

  // Time slots for the dropdown
  timeSlots = this.generateTimeSlots();

  constructor(
    private fb: FormBuilder,
    private colorService: ColorService,
    private examsService: ExamsService,
    public dialogRef: MatDialogRef<ScheduleSessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.courses = this.data.courses;
    this.isEditMode = !!this.data.event;
    this.loadExams();
    this.initForms();

    // Watch for course selection changes
    this.sessionForm.get('courseId')?.valueChanges.subscribe((courseId) => {
      const selectedCourse = this.courses.find(
        (course) => course.id === courseId
      );
      this.selectedCourseLevel = selectedCourse?.level || null;
    });
  }

  async loadExams() {
    try {
      const allExams = await this.examsService.getAllExams();
      this.exams = allExams.filter(exam => exam.status === 'submited');
    } catch (error) {
      console.error('Error loading exams:', error);
    }
  }

  initForms(): void {
    let startDate = new Date();
    if (this.data.start) {
      startDate = new Date(this.data.start);
    }

    this.sessionForm = this.fb.group({
      startDate: [startDate, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      courseId: [
        this.isEditMode
          ? this.data.event.extendedProps?.courseId
          : this.data.courseId || null,
        Validators.required
      ],
    });

    this.examForm = this.fb.group({
      examId: ['', Validators.required],
      startDate: [startDate, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  generateTimeSlots(): string[] {
    const slots: string[] = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }

  onSubmit(): void {
    if (this.selectedTabIndex === 0) {
      this.submitSession();
    } else {
      this.submitExam();
    }
  }

  submitSession(): void {
    if (this.sessionForm.invalid) {
      return;
    }

    const formValues = this.sessionForm.value;
    const selectedCourse = this.courses.find(
      (course) => course.id === formValues.courseId
    );

    if (!selectedCourse || !selectedCourse.level?.path?.id) {
      console.error('Invalid course or path');
      return;
    }

    formValues.title = selectedCourse.title;

    // Create start and end datetime objects
    const startDate = new Date(formValues.startDate);
    const endDate = new Date(formValues.startDate);

    // Parse time values
    const startTime = this.parseTime(formValues.startTime);
    const endTime = this.parseTime(formValues.endTime);

    if (startTime) {
      startDate.setHours(startTime.hours, startTime.minutes);
    }

    if (endTime) {
      endDate.setHours(endTime.hours, endTime.minutes);
    }

    // Get color based on path ID
    const color = this.colorService.getColorForCourse(
      selectedCourse.id!,
      selectedCourse.level.path.id
    );

    // Create the event object
    const eventData: any = {
      id: this.isEditMode ? this.data.event.id : null,
      title: formValues.title,
      start: startDate,
      end: endDate,
      backgroundColor: color,
      allDay: false,
      borderColor: color,
      extendedProps: {
        courseId: formValues.courseId,
        description: formValues.description
      },
    };

    this.dialogRef.close(eventData);
  }

  submitExam(): void {
    if (this.examForm.invalid) {
      return;
    }

    const formValues = this.examForm.value;
    const selectedExam = this.exams.find(exam => exam.id === formValues.examId);

    if (!selectedExam) {
      console.error('Invalid exam');
      return;
    }

    // Create start and end datetime objects
    const startDate = new Date(formValues.startDate);
    const endDate = new Date(formValues.startDate);

    // Parse time values
    const startTime = this.parseTime(formValues.startTime);
    const endTime = this.parseTime(formValues.endTime);

    if (startTime) {
      startDate.setHours(startTime.hours, startTime.minutes);
    }

    if (endTime) {
      endDate.setHours(endTime.hours, endTime.minutes);
    }

    // Create the event object
    const eventData: any = {
      id: selectedExam.id,
      title: selectedExam.title,
      start: startDate,
      end: endDate,
      backgroundColor: '#FF5722',
      allDay: false,
      borderColor: '#FF5722',
      extendedProps: {
        type: 'exam',
        examId: selectedExam.id,
        courseId: selectedExam.course?.id,
      },
    };

    this.dialogRef.close(eventData);
  }

  private parseTime(time: string): { hours: number; minutes: number } | null {
    if (!time) return null;

    const [hours, minutes] = time.split(':').map(Number);
    return {
      hours: hours || 0,
      minutes: minutes || 0
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
