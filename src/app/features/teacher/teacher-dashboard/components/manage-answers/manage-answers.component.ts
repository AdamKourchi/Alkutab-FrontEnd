import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {  MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormsModule } from '@angular/forms';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';

import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Course } from '../../../../../core/models/Course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesTeacherService } from '../../../../../core/services/teacher-courses.service';
import { ClassworkService } from '../../../../../core/services/classwork.service';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import moment, { now } from 'moment';
import 'moment/locale/ar';
import { User } from '../../../../../core/models/User.model';
import { Answer } from '../../../../../core/models/Answer.model';
import { Question } from '../../../../../core/models/Question.model';
registerLocaleData(localeAr);

@Component({
  selector: 'app-manage-answers',
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
    MatListModule,
  ],
  templateUrl: './manage-answers.component.html',
  styleUrl: './manage-answers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ar' },
  ],
})
export class ManageAnswersComponent {
  questions: Question[];
  students: User[];
  questionId: number;

  selectedStudent: User | null = null;
  selectedAnswer: Answer | null = null;

  courseService = inject(CoursesTeacherService);
  classworkService = inject(ClassworkService);

  private adapter = inject<DateAdapter<moment.Moment>>(DateAdapter);

  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<ManageAnswersComponent>, // Reference to the dialog
    @Inject(MAT_DIALOG_DATA)
    public data: { questionId: number; questions: any; students: any } // Inject the data
  ) {
    this.questions = data.questions;

    this.students = data.students;

    this.questionId = data.questionId;

    this.adapter.setLocale('ar'); // Set Arabic locale for moment
    moment.locale('ar'); // Moment global
  }

  ngOnInit() {
    this.selectStudent(this.students[0]);
  }

  haveTeacherComment(student: User) {
    const question = this.questions.find((q) => q.id === this.questionId);
    if (question) {
      const answer = question.answers.find(
        (a) => a.student && a.student.id === student.id
      );

      if (answer?.teacherComment) {
        return true;
      } else {
        return false;
      }
    }

    return false;
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

  selectStudent(student: User) {
    this.selectedStudent = student;
    const question = this.questions.find((q) => q.id === this.questionId);

    // Find the student's answer for this question
    if (question) {
      const answer = question.answers.find(
        (a) => a.student && a.student.id === student.id
      );

      this.selectedAnswer = answer
        ? Object.assign(
            new Answer(
              answer.id,
              answer.student,
              this.questions.find((q) => q.id === this.questionId) || null,
              answer.answerText,
              answer.teacherComment,
              answer.score,
              answer.createdAt,
              answer.updatedAt
            ),
            answer
          )
        : null; // Ensure it matches the Answer type
    }
  }

  submitCorrection() {
    if (!this.selectedAnswer) return;

    this.classworkService
      .updateAnswerCorrection(
        this.selectedAnswer.id!,
        this.selectedAnswer.teacherComment || ''
      )
      .then(() => {
        const question = this.questions.find((q) => q.id === this.questionId);
        if (question) {
          const answer = question.answers.find(
            (a) => a.student && a.student.id === this.selectedStudent?.id
          );
          if (answer) {
            answer.teacherComment = this.selectedAnswer?.teacherComment || '';
          }
        }
        this._snackBar.open('تم حفظ التصحيح بنجاح', 'إغلاق', {
          duration: 3000,
        });
      })
      .catch(() => {
        this._snackBar.open('حدث خطأ أثناء الحفظ', 'إغلاق', {
          duration: 3000,
        });
      });
  }
}
