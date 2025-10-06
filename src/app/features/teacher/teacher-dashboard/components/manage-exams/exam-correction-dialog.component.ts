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
import { MatSelectModule } from '@angular/material/select';

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
import { Exam } from '../../../../../core/models/Exam.model';
import { ExamSubmission } from '../../../../../core/models/ExamSubmission.model';
import { ExamsService } from '../../../../../core/services/exams.service';

registerLocaleData(localeAr);

@Component({
  selector: 'app-exam-correction-dialog',
  templateUrl: './exam-correction-dialog.component.html',
  styleUrl: './exam-correction-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatSelectModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'ar' },
  ],
})
export class ExamCorrectionDialog {
  exam: Exam;
  students: User[];
  submissions: ExamSubmission[] = [];

  selectedStudent: User | null = null;
  selectedSubmission: ExamSubmission | null = null;
  nextLevelDecision: 'pass' | 'fail' | null = null;

  courseService = inject(CoursesTeacherService);
  examService = inject(ExamsService);

  private adapter = inject<DateAdapter<moment.Moment>>(DateAdapter);
  private _snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<ExamCorrectionDialog>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: { exam: Exam; students: User[] }
  ) {
    this.exam = data.exam;
    this.students = data.students;

    this.adapter.setLocale('ar');
    moment.locale('ar');
  }

  ngOnInit() {
    this.fetchSubmissions()
  
  }

  fetchSubmissions() {
    this.examService.getExamSubmissions(this.exam.id!).then((submissions) => {
      this.submissions = submissions;
      
      // Only select student if we have both submissions and students
      if (this.students.length > 0 && this.submissions.length > 0) {
        this.selectStudent(this.students[0]);
        console.log(this.selectedSubmission);
        
      }
    });
  }

  hasTeacherComment(student: User) {
    const submission = this.submissions.find(
      (s) => s.student && s.student.id === student.id
    );
    return submission?.teacherComment ? true : false;
  }

  selectStudent(student: User) {
    this.selectedStudent = student;

    const submission = this.submissions.find(
      (s) => s.student && s.student.id === student.id
    );
    
    this.selectedSubmission = submission || null;
    this.cdr.detectChanges();
  }

  calculateAutomaticScore(submission: ExamSubmission): number {
    if (!submission.answers) return 0;
    
    let totalScore = 0;
    submission.answers.forEach(answer => {
      if (answer.isCorrect) {
        totalScore++;
      }
    });
    
    return totalScore;
  }

  getStudentSelectedOption(answer: any): string {
    if (answer.option?.optionText) {
      return answer.option.optionText;
    }
    if (answer.question?.options && answer.optionId) {
      const selectedOption = answer.question.options.find((opt: { id: string | number }) => opt.id === answer.optionId);
      return selectedOption?.optionText || 'لم يتم اختيار إجابة';
    }
    return 'لم يتم اختيار إجابة';
  }

  submitCorrection() {
    if (!this.selectedSubmission) return;

    const data = {
      teacher_comment: this.selectedSubmission.teacherComment,
      score: this.selectedSubmission.score,
      next_level_decision: this.nextLevelDecision
    };

    this.examService
      .updateExamSubmission(this.selectedSubmission.id!, data)
      .then(() => {
        this._snackBar.open('تم حفظ التصحيح بنجاح', 'إغلاق', {
          duration: 3000,
        });
        this.fetchSubmissions();
      })
      .catch(() => {
        this._snackBar.open('حدث خطأ أثناء الحفظ', 'إغلاق', {
          duration: 3000,
        });
      });
  }
} 