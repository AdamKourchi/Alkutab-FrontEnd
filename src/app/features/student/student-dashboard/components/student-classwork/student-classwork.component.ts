import {
  ChangeDetectionStrategy,
  Component,
  inject,
  LOCALE_ID,
  Pipe,
  PipeTransform,
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
import { AuthService } from '../../../../../core/services/authService.service';

import moment, { now } from 'moment';
import 'moment/locale/ar';
import { PostService } from '../../../../../core/services/posts.service';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { User } from '../../../../../core/models/User.model';
import { forwardRef } from '@angular/core';

registerLocaleData(localeAr);

@Component({
  selector: 'app-student-classwork',
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
    forwardRef(() => HasAnsweredPipe),
  ],
  templateUrl: './student-classwork.component.html',
  styleUrl: './student-classwork.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: LOCALE_ID, useValue: 'ar' }], // Set the locale to Arabic
})
export class StudentClassworkComponent {
  readonly dialog = inject(MatDialog);

  classworkService = inject(ClassworkService);
  postService = inject(PostService);
  authService = inject(AuthService);

  student!: any;

  today: Date = new Date();

  loading: boolean = true;

  courseId!: number;
  questions!: Question[];

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.route.parent?.params.subscribe((params) => {
      this.courseId = Number(params['id']);
    });
    this.fetchClassworks();
    this.fetchUser();
  }

  hasAnsweredQuestion(questionId: number | null): boolean {
    if (!questionId || !this.student?.answers) {
      return false;
    }
    return this.student.answers.some(
      (answer: any) => answer.question_id === questionId
    );
  }

  getAnswerByQuestionId(id: number | null) {
    if (id) {
      const answer = this.student?.answers?.find(
        (answer: any) => answer.question_id === id
      );

      return answer;
    } else {
      return undefined;
    }
  }

  fetchClassworks() {
    this.classworkService.getAllByCourseId(this.courseId).then((data) => {

      this.questions = data;
            
      this.loading = false;
      this.cdr.detectChanges();
    });
  }
  fetchUser() {
    this.authService.fetchUser().then((data) => {
      this.student = data;
      console.log(this.student);
      this.cdr.detectChanges();
    });
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
      this.fetchUser();
    });
  }

  openTextDialog(question: Question) {
    const dialogRef = this.dialog.open(AnswerTextDialog, {
      height: 'calc(100%)',
      width: 'calc(100%)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: { question: question },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.fetchClassworks();
      this.fetchUser();
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
}

@Pipe({
  name: 'hasAnswered',
  pure: true,
})
export class HasAnsweredPipe implements PipeTransform {
  transform(questionId: number | null, answers: any[]): boolean {
    if (!questionId || !answers) return false;
    return answers.some((answer: any) => answer.question_id === questionId);
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
  templateUrl: './dialog-answer-text.html',
  styleUrl: './dialog-answer-text.css',
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
export class AnswerTextDialog {
  question: Question;
  textForm!: FormGroup;
  postService = inject(PostService);

  classworkService = inject(ClassworkService);

  private adapter = inject<DateAdapter<moment.Moment>>(DateAdapter);

  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<AnswerTextDialog>, // Reference to the dialog
    @Inject(MAT_DIALOG_DATA) public data: { question: Question } // Inject the data
  ) {
    this.question = data.question;

    this.textForm = this.fb.group({
      answer: ['', Validators.required],
    });

    this.adapter.setLocale('ar');
    moment.locale('ar');
  }

  ngOnInit() {}

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

  onSubmit() {
    const data = this.textForm.value;

    data.question_id = this.question.id;

    this.classworkService
      .studentSubmit(data)
      .then(() => {
        this.dialogRef.close(); // Close the dialog
        // Show a snackbar in Arabic
        this._snackBar.open('تمت إرسال الإجابة', 'إغلاق', {
          duration: 3000,
        });
      })
      .catch((error) => {
        console.error('Error creating classwork:', error);
        this._snackBar.open('حدث خطأ أثناء إرسال الإجابة', 'إغلاق', {
          duration: 3000,
        });
      });
  }
}
