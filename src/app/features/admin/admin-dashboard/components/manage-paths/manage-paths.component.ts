import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';

import { MatCardModule } from '@angular/material/card';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTimepickerModule } from '@angular/material/timepicker';

import { PathsService } from '../../../../../core/services/paths.service';
import { Path } from '../../../../../core/models/Path.model';
import { Course } from '../../../../../core/models/Course.model';
import { Level } from '../../../../../core/models/Level.model';
import { User } from '../../../../../core/models/User.model';
import { TeachersService } from '../../../../../core/services/teachers.service';
import { CirclesService } from '../../../../../core/services/circles.service';
import { Circle } from '../../../../../core/models/Circle.model';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
registerLocaleData(localeAr);

@Component({
  selector: 'app-manage-paths',
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
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatTimepickerModule,
  ],
  templateUrl: './manage-paths.component.html',
  styleUrl: './manage-paths.component.css',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ar' },
  ],
})
export class ManagePathsComponent {
  private pathsService = inject(PathsService);
  private teachersService = inject(TeachersService);
  private circlesService = inject(CirclesService);

  paths: Path[] = [];

  selectedPath: Path | null = null;

  loading: boolean = true;

  readonly dialog = inject(MatDialog);

  pathForm!: FormGroup;

  teachers: User[] = [];

  daysOfWeek = [
    { value: 0, viewValue: 'الأحد' },
    { value: 1, viewValue: 'الإثنين' },
    { value: 2, viewValue: 'الثلاثاء' },
    { value: 3, viewValue: 'الأربعاء' },
    { value: 4, viewValue: 'الخميس' },
    { value: 5, viewValue: 'الجمعة' },
    { value: 6, viewValue: 'السبت' },
  ];

  get levels(): FormArray {
    return this.pathForm.get('levels') as FormArray;
  }

  get circles(): FormArray {
    return this.pathForm.get('circles') as FormArray;
  }

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit() {
    this.getPaths();
    this.loadTeachers();
    console.log(this.paths);
  }

  getPaths() {
    this.pathsService
      .getAllPaths()
      .then((data) => {
        this.paths = [...data];
        this.selectedPath = this.paths[0];
        if (this.selectedPath) {
          this.patchFormValues(this.selectedPath);
        }
        this.loading = false;
        console.log('Data from API:', this.paths);
      })
      .catch((error) => {
        console.error('Error fetching paths:', error);
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogCreatePath, {
      width: '500px',
      height: 'auto',
      data: { name: 'Create Path' },
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });

    const dialogInstance = dialogRef.componentInstance;

    dialogInstance.refreshPaths.subscribe(() => {
      this.getPaths();
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DialogDeletePath, {
      width: '500px',
      height: 'auto',
      data: { name: 'Delete Path' },
      panelClass: 'custom-dialog-container',
    });

    // Pass the selectedPath to the dialog component
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.selectedPath = this.selectedPath;

    dialogInstance.refreshPaths.subscribe(() => {
      this.getPaths();
    });
  }

  selectPath(path: Path) {
    this.selectedPath = path;
    this.patchFormValues(path);
    // if (path.isHifd) {
    //   this.getPaths();
    // }
  }

  createForm(): void {
    this.pathForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      diplomaTitle: ['', Validators.required],
      isActive: [true],
      isHifd: [false],
      levels: this.fb.array([]),
      circles: this.fb.array([]),
    });
  }

  createCourseForm(course: Course): FormGroup {
    return this.fb.group({
      id: [course.id],
      level_id: [course.level ? course.level.id : null],
      title: [course.title, Validators.required],
      description: [course.description],
      teacher_name: [course.teacher ? course.teacher.name : null],
    });
  }

  createLevelForm(level: Level): FormGroup {
    return this.fb.group({
      id: [level.id],
      pathId: [level.path ? level.path.id : null],
      name: [level.name, Validators.required],
      // Angular Material Datepicker has an issue where it's off by one day due to timezone handling
      // Adding one day as a temporary fix until a proper timezone solution is implemented
      startAt: [
        this.adjustDate(level.startAt)
          ? new Date(
              this.adjustDate(level.startAt)!.getTime() + 24 * 60 * 60 * 1000
            )
          : null,
        [Validators.required],
      ],
      endAt: [
        this.adjustDate(level.endAt)
          ? new Date(
              this.adjustDate(level.endAt)!.getTime() + 24 * 60 * 60 * 1000
            )
          : null,
        [Validators.required],
      ],
      description: [level.description],
      order: [level.order],
      courses: this.fb.array(
        level.courses?.map((course) => this.createCourseForm(course)) || []
      ),
    });
  }

  createCircleForm(circle: Circle): FormGroup {
    return this.fb.group({
      id: [circle.id],
      title: [circle.title, Validators.required],
      teacher: [circle.teacher?.id ?? null],
      daysOfWeek: [
        circle.daysOfWeek
          ? Array.isArray(circle.daysOfWeek)
            ? circle.daysOfWeek
            : JSON.parse(circle.daysOfWeek)
          : [],
      ],
      startTime: [
        circle.startTime ? this.convertToDate(circle.startTime) : '',
        Validators.required,
      ],
      endTime: [
        circle.endTime ? this.convertToDate(circle.endTime) : '',
        Validators.required,
      ],
    });
  }

  private convertToDate(dateString: string): Date {
    const d = new Date(dateString);
    return d;
  }

  private adjustDate(date: any): Date | null {
    if (!date) return null;
    const d = new Date(date);
    return new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
  }

  newLevel(): FormGroup {
    return this.fb.group({
      id: [null],
      name: ['', Validators.required],
      startAt: ['', [Validators.required]],
      endAt: ['', [Validators.required]],
      description: [''],
      order: [0],
      courses: this.fb.array([]),
    });
  }

  newCircle(): FormGroup {
    return this.fb.group({
      id: [null],
      title: ['', Validators.required],
      teacher: ['', Validators.required],
      daysOfWeek: [[], Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  addLevel(): void {
    this.levels.push(this.newLevel());
  }

  addCircle(): void {
    this.circles.push(this.newCircle());
  }

  removeLevel(i: number): void {
    this.levels.removeAt(i);
    this.snackBar.open('تم حذف المستوى بنجاح', 'إغلاق', { duration: 3000 });
  }

  deleteCircle(i: number): void {
    this.circles.removeAt(i);
    this.snackBar.open('تم حذف الحلقة بنجاح', 'إغلاق', { duration: 3000 });
  }

  getCourses(levelIndex: number): FormArray {
    return this.levels.at(levelIndex).get('courses') as FormArray;
  }

  calculateDurationMonths() {
    const startAt = this.pathForm.get('startAt')?.value;
    const endAt = this.pathForm.get('endAt')?.value;

    if (startAt && endAt) {
      const startDate = new Date(startAt);
      const endDate = new Date(endAt);

      if (startDate <= endDate) {
        let months =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());
        if (endDate.getDate() >= startDate.getDate()) {
          months += 1;
        }
        this.pathForm.get('durationMonths')?.setValue(months);
      } else {
        this.snackBar.open(
          'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
          'إغلاق',
          {
            duration: 3000,
          }
        );
      }
    }
  }

  loadTeachers(): void {
    this.teachersService
      .getAll()
      .then((data) => {
        this.teachers = data;
        console.log('Teachers loaded:', this.teachers);
      })
      .catch((error) => {
        console.error('Error loading teachers:', error);
        this.snackBar.open('حدث خطأ أثناء تحميل المعلمين', 'إغلاق', {
          duration: 3000,
        });
      });
  }

  patchFormValues(path: Path): void {
    this.pathForm.patchValue({
      id: path.id,
      name: path.name,
      description: path.description,
      diplomaTitle: path.diplomaTitle,
      isActive: path.isActive,
      isHifd: path.isHifd,
    });

    const levelsArray = this.pathForm.get('levels') as FormArray;

    levelsArray.clear(); // clean it up first

    path?.levels?.forEach((level) => {
      levelsArray.push(this.createLevelForm(level));
    });

    const circlesArray = this.pathForm.get('circles') as FormArray;

    circlesArray.clear(); // clean it up first

    path?.circles?.forEach((circle) => {
      circlesArray.push(this.createCircleForm(circle));
    });
  }

  calculateMonthsBetweenDates(startAt: any, endAt: any) {
    return Math.ceil(
      (new Date(endAt).getTime() - new Date(startAt).getTime()) /
        (1000 * 60 * 60 * 24 * 30)
    );
  }

  onSubmit(): void {
    if (this.pathForm.invalid) {
      this.snackBar.open('يرجى التأكد من ملء جميع الحقول المطلوبة', 'إغلاق', {
        duration: 3000,
      });
      return;
    }

    // Create a copy of the form value to adjust dates
    const formValue = { ...this.pathForm.value };

    if (formValue.levels) {
      formValue.levels = formValue.levels.map((level: any) => ({
        ...level,
        startAt: level.startAt
          ? new Date(
              new Date(level.startAt).getTime() -
                new Date(level.startAt).getTimezoneOffset() * 60 * 1000
            )
          : null,
        endAt: level.endAt
          ? new Date(
              new Date(level.endAt).getTime() -
                new Date(level.endAt).getTimezoneOffset() * 60 * 1000
            )
          : null,
      }));
    }

    // Convert the form value into a Path instance
    const updatedPath = new Path(
      formValue.id,
      formValue.name,
      formValue.description,
      null, //  createdBy
      formValue.diplomaTitle,
      formValue.isActive,
      formValue.isHifd,
      formValue.enrollment || null,
      formValue.levels || null,
      formValue.circles || null
    );

    if (updatedPath.levels) {
      // Convert the form value into a Level instance
      updatedPath.levels = updatedPath.levels.map((level: any) => {
        return new Level(
          level.id ? level.id : null,
          level.pathId ? level.pathId : null,
          level.name,
          level.startAt,
          level.endAt,
          this.calculateMonthsBetweenDates(level.startAt, level.endAt),
          level.description,
          level.order,
          level.courses || null // If courses are part of the form
        );
      });

      updatedPath.levels.forEach((level: any) => {
        level.courses = level.courses.map((course: any) => {
          return new Course(
            course.id,
            course.levelId,
            course.title,
            course.description,
            course.order,
            null // Assuming createdBy is not updated here
          );
        });
      });
    }

    if (updatedPath.circles) {
      updatedPath.circles = updatedPath.circles.map((circle: any) => {
        return new Circle(
          circle.id ? circle.id : null,
          circle.title,
          circle.pathId ? circle.pathId : null,
          new User(
            circle.teacher,
            circle.teacher.name,
            null,
            null,
            null,
            null,
            null,
            null,
            null
          ),
          circle.daysOfWeek || [],
          "offline",
          "",
          circle.startTime || null,
          circle.endTime || null
        );
      });
    }
    console.log('Updated Path:', updatedPath);

    this.pathsService
      .updatePath(updatedPath)
      .then(() => {
        this.snackBar.open('تم تحديث المسار التعليمي بنجاح', 'إغلاق', {
          duration: 3000,
        });

        // Refresh the paths after the update
        this.pathsService
          .getAllPaths()
          .then((data) => {
            this.paths = [...data];
            console.log('Paths updated:', this.paths);
          })
          .catch((error) => {
            console.error('Error fetching paths:', error);
          });
      })
      .catch((error) => {
        console.error('Error updating path:', error);
        this.snackBar.open('حدث خطأ أثناء تحديث المسار', 'إغلاق', {
          duration: 3000,
        });
      });
  }
}

@Component({
  selector: 'dialog-create-path',
  templateUrl: 'dialog-create-path.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ar' },
  ],
})
export class DialogCreatePath {
  private pathsService = inject(PathsService);

  createPathForm!: FormGroup;

  @Output() refreshPaths: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.createPathForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      diploma_title: ['', [Validators.required]],
      is_active: [true],
      is_hifd: [false],
    });
  }

  calculateDurationMonths() {
    const startAt = this.createPathForm.get('startAt')?.value;
    const endAt = this.createPathForm.get('endAt')?.value;

    if (startAt && endAt) {
      const startDate = new Date(startAt);
      const endDate = new Date(endAt);

      if (startDate <= endDate) {
        let months =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth());
        if (endDate.getDate() >= startDate.getDate()) {
          months += 1;
        }

        return months;
      }

      return null;
    }

    return null;
  }

  onSubmit() {
    if (this.createPathForm.valid) {
      console.log('Form Submitted:', this.createPathForm.value);
      const formValues = this.createPathForm.value;

      const newPath = new Path(
        null,
        formValues.name,
        formValues.description,
        null,
        formValues.diploma_title,
        formValues.is_active,
        formValues.is_hifd
      );

      this.pathsService
        .createPath(newPath)
        .then((data) => {
          console.log('Data from API:', data);
          this.refreshPaths.emit();
          // Close the dialog
          this.dialog.closeAll();

          // Show success message
          this.snackBar.open('تم إنشاء المسار بنجاح', 'إغلاق', {
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
          this.snackBar.open('حدث خطأ أثناء إنشاء المسار', 'إغلاق', {
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
  templateUrl: 'dialog-delete-path.html',
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
export class DialogDeletePath {
  private pathsService = inject(PathsService);
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  @Input() selectedPath: Path | null = null;
  @Output() refreshPaths: EventEmitter<void> = new EventEmitter<void>();

  Ondelete() {
    if (this.selectedPath && this.selectedPath.id !== null) {
      this.pathsService
        .deletePath(this.selectedPath.id)
        .then(() => {
          this.refreshPaths.emit();
          this.dialog.closeAll();
          this.snackBar.open('تم حذف المسار بنجاح', 'إغلاق', {
            duration: 3000,
          });
        })
        .catch((error) => {
          console.error('Error deleting path:', error);
          this.snackBar.open('حدث خطأ أثناء حذف المسار', 'إغلاق', {
            duration: 3000,
          });
        });
    }
  }

  onCancel() {
    this.refreshPaths.emit();
    this.dialog.closeAll();
  }
}
