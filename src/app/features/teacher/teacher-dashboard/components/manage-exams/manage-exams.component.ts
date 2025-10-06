import { Component, inject, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Course } from '../../../../../core/models/Course.model';
import { CoursesTeacherService } from '../../../../../core/services/teacher-courses.service';
import { Exam } from '../../../../../core/models/Exam.model';
import { ExamsService } from '../../../../../core/services/exams.service';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';

import { ExamQuestionOption } from '../../../../../core/models/ExamQuestionOption.model';
import { ExamQuestion } from '../../../../../core/models/ExamQuestion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateExamDialog } from './manage-exams-dialog.component';
import { ViewExamDialog } from '../../../../../shared/view-exam-dialog/view-exam-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExamCorrectionDialog } from './exam-correction-dialog.component';
import { AuthService } from '../../../../../core/services/authService.service';
import { User } from '../../../../../core/models/User.model';

@Component({
  selector: 'app-manage-exams',
  templateUrl: './manage-exams.component.html',
  styleUrls: ['./manage-exams.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
})
export class ManageExamsComponent implements OnInit {
  courseId!: number;
  loading = true;
  exams: Exam[] = [];
  students: User[] = [];

  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  private examService = inject(ExamsService);
  private authService = inject(AuthService);

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.parent?.params.subscribe((params) => {
      this.courseId = Number(params['id']);
      this.fetchExams(this.courseId);
      this.fetchStudents();
    });
  }

  fetchExams(courseId: number) {
    this.examService.getExamByCourseId(courseId).then((exams) => {
      this.exams = exams;
      this.loading = false;
    });
  }

  fetchStudents() {
    this.authService.getStudentsByCourseId(this.courseId).then((students) => {
      this.students = students;
    });
  }

  openExamDialog() {
    const dialogRef = this.dialog.open(CreateExamDialog, {
      height: 'calc(100%)',
      width: 'calc(100%)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: { courseId: this.courseId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchExams(this.courseId);
      }
    });
  }

  viewExam(exam: Exam) {
    this.dialog.open(ViewExamDialog, {
      width: '80%',
      maxHeight: '90vh',
      data: { exam },
    });
  }

  deleteExam(examId: number | null) {
    if (!examId) {
      this._snackBar.open('حدث خطأ أثناء حذف الإختبار', 'حسناً', {
        duration: 3000,
      });
      return;
    }
    if (confirm('هل أنت متأكد من حذف هذا الإختبار؟')) {
      this.examService.deleteExam(examId).then(() => {
        this._snackBar.open('تم حذف الإختبار بنجاح', 'حسناً', {
          duration: 3000,
        });
        this.fetchExams(this.courseId);
      }).catch((error) => {
        this._snackBar.open('حدث خطأ أثناء حذف الإختبار', 'حسناً', {
          duration: 3000,
        });
      });
    }
  }

  startCorrection(examId: number | null) {
    if (!examId) {
      this._snackBar.open('حدث خطأ أثناء بدء التصحيح', 'حسناً', {
        duration: 3000,
      });
      return;
    }

    const exam = this.exams.find(e => e.id === examId);
    if (!exam) return;

    const dialogRef = this.dialog.open(ExamCorrectionDialog, {
      height: 'calc(100%)',
      width: 'calc(100%)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: { exam, students: this.students },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchExams(this.courseId);
      }
    });
  }
}

