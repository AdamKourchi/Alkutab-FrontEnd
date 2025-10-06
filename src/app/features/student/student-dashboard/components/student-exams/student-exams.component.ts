import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExamsService } from '../../../../../core/services/exams.service';
import { Exam } from '../../../../../core/models/Exam.model';
import { AuthService } from '../../../../../core/services/authService.service';
import { User } from '../../../../../core/models/User.model';
import { TakeExamDialog } from './take-exam-dialog.component';

@Component({
  selector: 'app-student-exams',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './student-exams.component.html',
  styleUrl: './student-exams.component.css'
})
export class StudentExamsComponent implements OnInit {
  loading = true;
  exams: Exam[] = [];
  student!: any;

  private examService = inject(ExamsService);
  private authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.fetchExams();
    this.fetchUser();
    
  }

  fetchExams() {
    this.examService.getAllExams().then((exams) => {
      // Filter exams that are dated and not yet ended
      this.exams = exams.filter(exam => {
        if (exam.status !== 'dated' || !exam.startTime || !exam.endTime) return false;
        const now = new Date();
        const startTime = new Date(exam.startTime);
        const endTime = new Date(exam.endTime);
        return now <= endTime; // Show exams that haven't ended yet
      });
      this.loading = false;
    });
  }

  fetchUser() {
    this.authService.fetchUser().then((data) => {
      this.student = data;


    });
  }

  canTakeExam(exam: Exam): boolean {
    if (!exam.startTime || !exam.endTime) return false;
    const now = new Date();
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    return now >= startTime && now <= endTime;
  }

  hasAnsweredExam(examId: number | null): boolean {


    if (!examId || !this.student?.exam_submissions) return false;
    return this.student.exam_submissions.some(
      (submission: any) => submission.exam_id === examId
    );
    
  }



  takeExam(exam: Exam) {
    if (!this.canTakeExam(exam)) {
      this._snackBar.open('لم يحن وقت الاختبار بعد أو انتهى', 'إغلاق', {
        duration: 3000,
      });
      return;
    }

    if (this.hasAnsweredExam(exam.id)) {
      this._snackBar.open('لقد قمت بإجراء هذا الاختبار مسبقاً', 'إغلاق', {
        duration: 3000,
      });
      return;
    }

    const dialogRef = this.dialog.open(TakeExamDialog, {
      height: 'calc(100%)',
      width: 'calc(100%)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: { exam },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchExams();
        this.fetchUser();
      }
    });
  }
}
