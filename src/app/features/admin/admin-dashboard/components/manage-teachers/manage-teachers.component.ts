import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
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

import { User } from '../../../../../core/models/User.model';
import { TeachersService } from '../../../../../core/services/teachers.service';

@Component({
  selector: 'app-manage-teachers',
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
  ],
  templateUrl: './manage-teachers.component.html',
  styleUrl: './manage-teachers.component.css',
})
export class ManageTeachersComponent {
  teachersService = inject(TeachersService);

  teachers: User[] = [];

  selectedTeacher: User | null = null;

  teacherForm!: FormGroup;

  readonly dialog = inject(MatDialog);

  today = new Date();

  get teachings(): FormArray {
    return this.teacherForm.get('teachings') as FormArray;
  }

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    const passwordForm = this.fb.group({});
  }

  ngOnInit() {
    this.createTeacherForm();
    this.getTeachers();
  }

  createTeacherForm() {
    this.teacherForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
    });
  }

  getTeachers() {
    this.teachersService
      .getAll()
      .then((data) => {
        this.teachers = [...data];

        this.selectedTeacher = this.teachers[0];

        this.selectedTeacher ? this.patchValues(this.teachers[0]): null;

        console.log('Data from API:', this.teachers);
      })
      .catch((error) => {
        console.error('Error fetching paths:', error);
      });
  }

  patchValues(teacher: User) {
    this.teacherForm.patchValue({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
    });
  }

  selectTeacher(teacher: User) {
    this.selectedTeacher = teacher;
    this.patchValues(teacher);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(DialogCreateTeacher, {
      width: '500px',
      height: 'auto',
      data: { name: 'Create Teacher' },
      panelClass: 'custom-dialog-container',
    });

    const dialogInstance = dialogRef.componentInstance;

    dialogInstance.refreshTeachers.subscribe(() => {
      this.getTeachers();
    });
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DialogDeleteTeacher, {
      width: '500px',
      height: 'auto',
      data: { name: 'Delete Path' },
      panelClass: 'custom-dialog-container',
    });

    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.selectedTeacher = this.selectedTeacher;

    dialogInstance.refreshTeachers.subscribe(() => {
      this.getTeachers();
    });
  }
}

@Component({
  selector: 'dialog-create-teacher',
  templateUrl: 'dialog-create-teacher.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogCreateTeacher {
  private teachersService = inject(TeachersService);

  createTeacherForm!: FormGroup;

  @Output() refreshTeachers: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.createTeacherForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.createTeacherForm.valid) {
      console.log('Form Submitted:', this.createTeacherForm.value);
      const formValues = this.createTeacherForm.value;

      const newTeacher = new User(
        null,
        formValues.name,
        formValues.email,
        null,
        null,
        null
      );

      this.teachersService
        .inviteTeacher(newTeacher)
        .then((data) => {
          console.log('Data from API:', data);

          // Emit the refresh event to notify the parent component
          this.refreshTeachers.emit();
          // Close the dialog
          this.dialog.closeAll();

          // Show success message
          this.snackBar.open('تم إرسال الدعوة بنجاح', 'إغلاق', {
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
          this.snackBar.open('حدث خطأ أثناء إرسال الدعوة', 'إغلاق', {
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
export class DialogDeleteTeacher {
  private teachersService = inject(TeachersService);

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  @Input() selectedTeacher: User | null = null;
  @Output() refreshTeachers: EventEmitter<void> = new EventEmitter<void>();

  Ondelete() {
    if (this.selectedTeacher && this.selectedTeacher.id !== null) {
      this.teachersService
        .deleteTeacher(this.selectedTeacher.id)
        .then(() => {
          this.refreshTeachers.emit();
          this.dialog.closeAll();
          this.snackBar.open('تم حذف الأستاذ بنجاح', 'إغلاق', {
            duration: 3000,
          });
        })
        .catch((error) => {
          console.error('Error deleting path:', error);
          this.snackBar.open('حدث خطأ أثناء حذف الأستاذ', 'إغلاق', {
            duration: 3000,
          });
        });
    }
  }

  onCancel() {
    this.refreshTeachers.emit();
    this.dialog.closeAll();
  }
}
