import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabulatorTableComponent } from '../../../../../shared/tabulator-table/tabulator-table.component';
import { StudentsService } from '../../../../../core/services/students.service';
import { enrollmentRequestService } from '../../../../../core/services/enrollmentRequest.service';
import { EnrollmentRequest } from '../../../../../core/models/EnrollmentRequest.model';
import { CirclesService } from '../../../../../core/services/circles.service';

@Component({
  selector: 'app-admin-students',
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatDialogModule,
    TabulatorTableComponent,
  ],
})
export class AdminStudentsComponent implements OnInit {
  @ViewChild('rejectionDialog') rejectionDialog!: TemplateRef<any>;
  @ViewChild('circleDialog') circleDialog!: TemplateRef<any>;

  applications: any[] = [];
  enrolledStudents: any[] = [];
  circles: any[] = [];
  rejectionReason: string = '';
  loading = false;
  selectedCircleId: number | null = null;

  // Tabulator columns configuration
  enrollmentColumns = [
    { title: 'الاسم', field: 'user.name' },
    { title: 'المسار', field: 'path.name' },
    {
      title: 'الحلقة',
      field: 'circle.title',
      formatter: (cell: any) => cell.getValue() || '-',
    },
        {
      title: 'المستوى',
      field: 'level.name',
      formatter: (cell: any) => cell.getValue() || '-',
    },
    {
      title: 'الحالة',
      field: 'status',
      formatter: (cell: any) => {
        const value = cell.getValue();
        if (value === 'waiting_for_admission') {
          return `<span style="color: #F59E0B">تنتظر الموافقة</span>`;
        } else if (value === 'in_progress') {
          return `<span style="color: #10B981"> قيد الدراسة</span>`;
        }
        return value || '-';
      },
    },
    { title: 'التاريخ', field: 'enrolledAt' },
  ];

  constructor(
    private dialog: MatDialog,
    private studentsService: StudentsService,
    private requestService: enrollmentRequestService,
    private circlesService: CirclesService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      const [enrollments, applications, circles] = await Promise.all([
        this.studentsService.getAllEnrollments(),
        this.requestService.getAllRequests(),
        this.circlesService.getAllCircles(),
      ]);

      this.applications = applications;
      this.enrolledStudents = enrollments;
      this.circles = circles;
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.loading = false;
      console.log(this.enrolledStudents);
      
    }
  }

  async acceptApplication(request: EnrollmentRequest): Promise<void> {
    const dialogRef = this.dialog.open(this.circleDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (reason) => {
      if (reason) {
        try {
          await this.requestService.approveRequest(request.id!, this.selectedCircleId!);
          await this.loadData();
        } catch (error) {
          console.error('Error accepting application:', error);
        }
      }
    });
  }

  async rejectApplication(request: EnrollmentRequest): Promise<void> {
    const dialogRef = this.dialog.open(this.rejectionDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (reason) => {
      if (reason) {
        try {
          await this.requestService.rejectRequest(request.id!, reason);
          await this.loadData();
        } catch (error) {
          console.error('Error rejecting application:', error);
        }
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'waiting':
        return 'yellow';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  }
}
