import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PathsService } from '../../../../../core/services/paths.service';
import { Path } from '../../../../../core/models/Path.model';
import { Course } from '../../../../../core/models/Course.model';
import { Level } from '../../../../../core/models/Level.model';
import { User } from '../../../../../core/models/User.model';
import { TeachersService } from '../../../../../core/services/teachers.service';
import { CoursesService } from '../../../../../core/services/courses.service';


@Component({
  selector: 'app-manage-courses',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatExpansionModule,
    MatSidenavModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './manage-courses.component.html',
  styleUrl: './manage-courses.component.css',
})
export class ManageCoursesComponent {
  private coursesService = inject(CoursesService);
  private teachersService = inject(TeachersService);

  loading : boolean = true;

  courses: Course[] = [];

  selectedCourse: Course | null = null;

  readonly dialog = inject(MatDialog);

  courseForm!: FormGroup;

  teachers: User[] = [];

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit() {
    this.getCourses();
    this.getTeachers();
  }

  getCourses() {
    this.coursesService
      .getAll()
      .then((data) => {
        this.courses = [...data];

        this.selectedCourse = this.courses[0];

        this.selectedCourse ? this.patchFormValues(this.selectedCourse) : null;

        this.loading = false;
      })
      .catch((error) => {
        console.error('Error fetching paths:', error);
      });
  }

  getTeachers() {
    this.teachersService
      .getAll()
      .then((data) => {
        this.teachers = [...data];
      })
      .catch((error) => {
        console.error('Error fetching paths:', error);
      });
  }

  createForm(): void {
    this.courseForm = this.fb.group({
      id: [''],
      path: [null, Validators.required],
      level: [null, Validators.required],
      levelId: [null, Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      teacher: [null],
    });
  }

  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.patchFormValues(course);
  }

  patchFormValues(course: Course): void {
    
    this.courseForm.patchValue({
      id: course.id,
      path: course.level?.path?.name || null,
      level: course.level?.name || null,
      levelId: course.level?.id || null,
      title: course.title,
      description: course.description,
      teacher: course.teacher ?.id|| null
    });
  }


  openDialog() {
    const dialogRef = this.dialog.open(DialogCreateCourse, {
      width: '500px',
      height: 'auto',
      data: { name: 'Create Path' },
      panelClass: 'custom-dialog-container',
      disableClose:true,
    });

    const dialogInstance = dialogRef.componentInstance;

    dialogInstance.refreshCourses.subscribe(() => {
      this.getCourses();
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DialogDeleteCourse, {
      width: '500px',
      height: 'auto',
      data: { name: 'Delete Path' },
      panelClass: 'custom-dialog-container',
    });

    // Pass the selectedPath to the dialog component
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.selectedCourse = this.selectedCourse;

    dialogInstance.refreshCourses.subscribe(() => {
      this.getCourses();
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.snackBar.open('يرجى التأكد من ملء جميع الحقول المطلوبة', 'إغلاق', {
        duration: 3000,
      });
      return;
    }

    // Convert the form value into a Course instance
    const updatedCourse = new Course(
      this.courseForm.value.id,
      this.courseForm.value.levelId,
      this.courseForm.value.title,
      this.courseForm.value.description,
      null, // Assuming order is not updated here
      this.teachers.find(teacher => teacher.id === this.courseForm.value.teacher) || null 
    );

    console.log('Updated Course:', updatedCourse);

    this.coursesService
      .updateCourse(updatedCourse)
      .then(() => {
        this.snackBar.open('تم تحديث الدورة بنجاح', 'إغلاق', {
          duration: 3000,
        });

        // Refresh the courses after the update
        this.getCourses();
      })
      .catch((error) => {
        console.error('Error updating course:', error);
        this.snackBar.open('حدث خطأ أثناء تحديث الدورة', 'إغلاق', {
          duration: 3000,
        });
      });
  }
}

@Component({
  selector: 'dialog-create-course',
  templateUrl: 'dialog-create-course.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCreateCourse {
  private coursesService = inject(CoursesService);

  createCourseForm!: FormGroup;
  private pathsService = inject(PathsService);
  private teachersService = inject(TeachersService);

  paths: Path[] = [];
  levels: Level[] = [];
  teachers: User[] = [];

  @Output() refreshCourses: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getPaths();
    this.getTeachers();

    this.createCourseForm = this.fb.group({
      path: [null, [Validators.required]],
      level: [{ value: null, disabled: true }, Validators.required],
      title: ['', [Validators.required]],
      teacher: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });

    // Dynamically update levels when path changes
    this.createCourseForm
      .get('path')
      ?.valueChanges.subscribe((selectedPath) => {
        if (selectedPath && selectedPath.levels?.length) {
          this.levels = selectedPath.levels;
          this.createCourseForm.get('level')?.enable();
        } else {
          this.levels = [];
          this.createCourseForm.get('level')?.disable();
        }
      });
  }
  getPaths() {
    this.pathsService
      .getAllPaths()
      .then((data) => {
        this.paths = [...data];
      })
      .catch((error) => {
        console.error('Error fetching paths:', error);
      });
  }

  getTeachers() {
    this.teachersService
      .getAll()
      .then((data) => {
        this.teachers = [...data];
      })
      .catch((error) => {
        console.error('Error fetching paths:', error);
      });
  }

  onSubmit() {
    if (this.createCourseForm.valid) {
      console.log('Form Submitted:', this.createCourseForm.value);

      const formValues = this.createCourseForm.value;

      const newCourse = new Course(
        null,
        formValues.level,
        formValues.title,
        formValues.description,
        null,
        formValues.teacher
      );

      this.coursesService
        .createCourse(newCourse)
        .then((data) => {
          // Emit the refresh event to notify the parent component
          this.refreshCourses.emit();
          // Close the dialog
          this.dialog.closeAll();

          // Show success message
          this.snackBar.open('تم إنشاء الدورة بنجاح', 'إغلاق', {
            duration: 3000,
          });

          // Notify the parent component to refresh the paths
          this.dialog.afterAllClosed.subscribe(() => {
            // Emit an event or call a method in the parent component
            // This will be handled in the parent component
          });
        })
        .catch((error) => {
          console.error('Error creating path:', error);
          this.snackBar.open('حدث خطأ أثناء إنشاء الدورة', 'إغلاق', {
            duration: 3000,
          });
        });
    } else {
      console.log('Form is invalid');
    }
  }
}

@Component({
  selector: 'dialog-delete-path',
  templateUrl: 'dialog-delete-course.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDeleteCourse {
  private coursesService = inject(CoursesService);
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  @Input() selectedCourse: Course | null = null;
  @Output() refreshCourses: EventEmitter<void> = new EventEmitter<void>();

  Ondelete() {
    if (this.selectedCourse && this.selectedCourse.id !== null) {
      this.coursesService
        .deleteCourse(this.selectedCourse.id)
        .then(() => {
          this.refreshCourses.emit();
          this.dialog.closeAll();
          this.snackBar.open('تم حذف  الدورة بنجاح', 'إغلاق', {
            duration: 3000,
          });
        })
        .catch((error) => {
          console.error('Error deleting path:', error);
          this.snackBar.open('حدث خطأ أثناء حذف  الدورة', 'إغلاق', {
            duration: 3000,
          });
        });
    }
  }

  onCancel() {
    this.refreshCourses.emit();
    this.dialog.closeAll();
  }
}
