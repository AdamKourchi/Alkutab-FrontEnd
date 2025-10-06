import {
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormGroup } from '@angular/forms';
import { FormBuilder, Validators, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ChangeDetectorRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Course } from '../../../../../core/models/Course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesTeacherService } from '../../../../../core/services/teacher-courses.service';
import { Question } from '../../../../../core/models/Question.model';
import { ClassworkService } from '../../../../../core/services/classwork.service';

import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import moment, { now } from 'moment';
import 'moment/locale/ar';
import { PostService } from '../../../../../core/services/posts.service';
import { AuthService } from '../../../../../core/services/authService.service';
import { User } from '../../../../../core/models/User.model';
import { ManageAnswersComponent } from '../manage-answers/manage-answers.component';
import { Answer } from '../../../../../core/models/Answer.model';
import { ManageExamsComponent } from '../manage-exams/manage-exams.component';
registerLocaleData(localeAr);

@Component({
  selector: 'app-manage-classwork',
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatExpansionModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './manage-classwork.component.html',
  styleUrl: './manage-classwork.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageClassworkComponent {
  readonly dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);

  classworkService = inject(ClassworkService);
  postService = inject(PostService);
  authService = inject(AuthService);

  today: Date = new Date();

  students:User[ ] = [];

  loading: boolean = true;

  courseId!: number;

  questions!: Question[];

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.parent?.params.subscribe((params) => {
      this.courseId = Number(params['id']);
    });

    this.fetchClassworks();
    this.fetchStudents()
  }

  fetchClassworks() {
    this.classworkService.getAllByCourseId(this.courseId).then((data) => {

      this.questions = data;      
      
      this.loading = false;

      this.cdr.detectChanges();
    });
  }

  fetchStudents(){
    this.authService.getStudentsByCourseId(this.courseId).then((data)=>{
      console.log(data);
      this.students = data;
            this.cdr.detectChanges();

    })
  }

  openMCDialog() {
    const dialogRef = this.dialog.open(CreateMCDialog, {
      height: 'calc(100% - 30px)',
      width: 'calc(100% - 30px)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.fetchClassworks();
    });
  }

  openTextDialog() {
    const dialogRef = this.dialog.open(CreateTextDialog, {
      height: 'calc(100%)',
      width: 'calc(100%)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: { courseId: this.courseId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.fetchClassworks();
    });
  }

  openCorrectionDialog(id : number | null) {
    const dialogRef = this.dialog.open(ManageAnswersComponent, {
      height: 'calc(100%)',
      width: 'calc(100%)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: {questionId : id ,questions: this.questions , students : this.students },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.fetchClassworks();
    });
  }

  downloadFile(attachment: string) {
    this.postService
      .downloadFile(attachment)
      .then((response) => {
        console.log('File downloaded successfully:', response);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  }

  deleteQuestion(id: number | null) {
    if (id) {
      this.classworkService
        .deleteQuestion(id)
        .then((response) => {
          console.log(response);
          this._snackBar.open('تم حذف الواجب بنجاح', 'إغلاق', {
            duration: 3000,
          });
          this.fetchClassworks();
  
        })
        .catch((error) => {
          console.log(error);
          this._snackBar.open('حدث خطأ أثناء حذف الواجب', 'إغلاق', {
            duration: 3000,
          });
        });
    } else {
      console.log('No Id');
    }
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-create-mc.html',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMCDialog {}
@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './dialog-create-text.html',
  styleUrl: './dialog-create-text.css',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    QuillModule,
    CommonModule,
    FormsModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ar' },
  ],
})
export class CreateTextDialog {
  courseId!: number;
  course!: Course;
  textForm!: FormGroup;
  selectedFiles: File[] = [];
  selectedFileName: string = '';

  courseService = inject(CoursesTeacherService);
  classworkService = inject(ClassworkService);

  private adapter = inject<DateAdapter<moment.Moment>>(DateAdapter);

  private _snackBar = inject(MatSnackBar);

  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    return date ? date >= today : false;
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<CreateTextDialog>, // Reference to the dialog
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number } // Inject the data
  ) {
    this.courseId = data.courseId;

    this.textForm = this.fb.group({
      question: ['', [Validators.required, Validators.maxLength(100)]],
      instructions: ['', [Validators.maxLength(500)]],
      deadline: [null],
      attachment: [''],
      type: ['text'],
    });

    this.adapter.setLocale('ar'); // Set Arabic locale for moment
    moment.locale('ar'); // Moment global
  }

  ngOnInit() {
    this.fetchCourse(this.courseId);
  }

  fetchCourse(id: number) {
    this.courseService
      .fetchCourse(id)
      .then((data) => {
        this.course = data;
        console.log(data);
        
      })
      .catch((error) => {
        console.error('Error fetching course:', error);
      });
  }

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
    ],
  };

  onEditorCreated(editor: Quill) {
    editor.format('direction', 'rtl');
    editor.format('align', 'right');
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.selectedFiles = Array.from(target.files); // Store the selected files
      this.textForm.patchValue({ images: this.selectedFiles }); // Update the form control
      console.log('Selected files:', this.selectedFiles);
    }
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      // You can also patch it to your form
      this.textForm.get('attachment')?.setValue(file);
    }
  }

  onSubmit() {
    const data = this.textForm.value;

    const question = new Question(
      null,
      Course.fromApi(this.course),
      data.question,
      data.deadline.toISOString(),
      data.instructions,
      data.attachment,
      data.type,
      [],
      []
    );

    this.classworkService
      .createQuestion(question)
      .then(() => {
        this.dialogRef.close(); // Close the dialog
        this._snackBar.open('تم إنشاء الواجب بنجاح', 'إغلاق', {
          duration: 3000,
        });
      })
      .catch((error) => {
        console.error('Error creating classwork:', error);
        this._snackBar.open('حدث خطأ أثناء إنشاء الواجب', 'إغلاق', {
          duration: 3000,
        });
      });
  }
}
