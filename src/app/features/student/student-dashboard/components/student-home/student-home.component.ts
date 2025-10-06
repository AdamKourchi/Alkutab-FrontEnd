import { Component, inject } from '@angular/core';
import { StudentPathService } from '../../../../../core/services/student-path.service';
import { Path } from '../../../../../core/models/Path.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../../core/services/authService.service';
import { User } from '../../../../../core/models/User.model';
import { DialogEnrollPath } from './dialog-enroll-path';
import { enrollmentRequestService } from '../../../../../core/services/enrollmentRequest.service';
import { Enrollment } from '../../../../../core/models/Enrollment.model';
import { EnrollmentRequest } from '../../../../../core/models/EnrollmentRequest.model';
import { DialogEnrollPathNormal } from './dialog-enroll-path-normal';

@Component({
  selector: 'app-student-home',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.css',
})
export class StudentHomeComponent {
  private _snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  studentPathService = inject(StudentPathService);
  private authService = inject(AuthService);

  requestService = inject(enrollmentRequestService);

  currentEnrollment: Enrollment | null = null;

  pastEnrollmentRequests: EnrollmentRequest[] | null = null;

  student!: any;
  paths: Path[] = [];
  loading: boolean = true;

  ngOnInit() {
    Promise.all([this.getUser(), this.getAllPaths()]).finally(() => {
      this.loading = false;
      
    });
  }

  getUser(): Promise<void | EnrollmentRequest | null> {
    return this.authService
      .fetchUser()
      .then((user) => {
        this.student = user;
        this.currentEnrollment =
          user.enrollments?.find((e:any) => !e.graduated) || null;
        return this.getLastEnrollmentRequest();
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }

  getLastEnrollmentRequest(): Promise<void> {
    return this.requestService
      .getRequestsByStudentId(this.student.id)
      .then((requests) => {
        this.pastEnrollmentRequests = requests.length > 0 ? requests : [];
      })
      .catch((error) => {
        console.error('Error fetching past enrollment requests:', error);
      });
  }

  getAllPaths(): Promise<void> {
    return this.studentPathService
      .getAllPaths()
      .then((paths: Path[]) => {
        this.paths = paths;
      })
      .catch((error) => {
        console.error('Error fetching paths:', error);
      });
  }

  enroll(pathId: number) {
    const path = this.paths.find((p) => p.id === pathId);
    if (!path) return;

    if (path.isHifd) {
      const dialogRef = this.dialog.open(DialogEnrollPath, {
        height: 'calc(100%)',
        width: 'calc(100%)',
        maxWidth: '100%',
        maxHeight: '100%',
        disableClose: true,
        data: { path, user: this.student },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);

          this.requestService
            .createRequest(result.request, pathId)
            .then((request) => {
              console.log(request);
              this.getUser();
              this._snackBar.open('تم تقديم طلب التسجيل بنجاح!', 'إغلاق', {
                duration: 2000,
              });
            })
            .catch((error) => {
              console.error('Error enrolling in path:', error);
              this._snackBar.open('حدث خطأ أثناء تقديم طلب التسجيل', 'إغلاق', {
                duration: 2000,
              });
            });
        }
      });
    } else {
      const dialogRef = this.dialog.open(DialogEnrollPathNormal, {
        height: 'calc(100%)',
        width: 'calc(100%)',
        maxWidth: '100%',
        maxHeight: '100%',
        disableClose: true,
        data: { path, user: this.student },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
              this.getUser();

          this.requestService
            .createRequest(result.request, pathId)
            .then((request) => {
              console.log(request);
              this._snackBar.open('تم تقديم طلب التسجيل بنجاح!', 'إغلاق', {
                duration: 2000,
              });
            })
            .catch((error) => {
              console.error('Error enrolling in path:', error);
              this._snackBar.open('حدث خطأ أثناء تقديم طلب التسجيل', 'إغلاق', {
                duration: 2000,
              });
            });
        }
      });
    }
  }

  calculateTotalDuration(path: any): number {
    return (
      path.levels?.reduce(
        (total: number, level: any) => total + (level.durationMonths || 0),
        0
      ) || 0
    );
  }
}
