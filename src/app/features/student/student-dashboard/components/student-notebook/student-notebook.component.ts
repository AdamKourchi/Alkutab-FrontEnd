import { Component, inject, ViewChild } from '@angular/core';
import { User } from '../../../../../core/models/User.model';
import { ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { TabulatorTableComponent } from '../../../../../shared/tabulator-table/tabulator-table.component';
import { AuthService } from '../../../../../core/services/authService.service';

@Component({
  selector: 'app-student-notebook',
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    TabulatorTableComponent,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './student-notebook.component.html',
  styleUrl: './student-notebook.component.css',
})
export class StudentNotebookComponent {
  @ViewChild(TabulatorTableComponent) tabulatorTable?: TabulatorTableComponent;

  private authService = inject(AuthService);

  student!: User;

  circleId!: number;
  wajibs!: any[];
  loading: boolean = true;

  collums = [
    {
      formatter: 'responsiveCollapse',
      width: 30,
      responsive: 0,
      hozAlign: 'center',
      resizable: false,
      headerSort: false,
    },
    {
      title: 'التاريخ',
      field: 'due_date',
      headerSort: false,
      hozAlign: 'center',
      width: 150,
      responsive: 0,
    },

    { title: 'السورة ', field: 'surat', headerSort: false, hozAlign: 'center' },
    {
      title: 'من الآية ',
      field: 'from_aya',
      headerSort: false,
      hozAlign: 'center',
      width: 100,
      responsive: 2,
    },
    {
      title: 'إلى الآية ',
      field: 'to_aya',
      headerSort: false,
      hozAlign: 'center',
      width: 100,
      responsive: 2,
    },
    {
      title: 'التقدير ',
      field: 'mark',
      formatter: (cell: any) => {
        const value = cell.getValue();
        if (value === 'vg') {
          return `<span class="font-bold text-green-500" >جيد جدا</span>`;
        } else if (value === 'g') {
          return `<span class="font-bold text-blue-500"  > جيد</span>`;
        } else if (value === 'p') {
          return `<span class="font-bold text-yellow-500"  > حسن</span>`;
        } else if (value === 'r') {
          return `<span  class="font-bold text-red-500">  إعادة</span>`;
        }

        return value || '-';
      },
      width: 100,
      headerSort: false,
      hozAlign: 'center',
      responsive: 2,
    },
  ];

  options = {
    responsiveLayout: 'collapse',
    layout: 'fitDataFill',
    responsiveLayoutCollapseStartOpen: false,
    pagination: true,
    paginationSize: 10,
    paginationSizeSelector: [10, 20, 50],
    height: 'calc(100vh - 200px)',
    textDirection: 'rtl',
    locale: 'ar',
    langs: {
      ar: {
        pagination: {
          first: 'الأول',
          first_title: 'الصفحة الأولى',
          last: 'الأخير',
          last_title: 'الصفحة الأخيرة',
          prev: 'السابق',
          prev_title: 'الصفحة السابقة',
          next: 'التالي',
          next_title: 'الصفحة التالية',
        },
      },
    },
  };

  constructor(private route: ActivatedRoute) {}

  refreshTable() {
    if (this.wajibs) {
      this.tabulatorTable?.setData(this.wajibs);

      const pageSize = this.options.paginationSize || 10;
      const totalPages = Math.ceil(this.wajibs.length / pageSize);

      if (this.tabulatorTable && totalPages > 0) {
        this.tabulatorTable.setPage(totalPages);
      }
    }
  }

  ngOnInit() {
    this.route.parent?.params.subscribe((params) => {
      this.circleId = Number(params['id']);
      this.getStudentWithRecord();
    });
  }

  async getStudentWithRecord() {
    this.loading = true;
    try {
      this.student = await this.authService.fetchUser();
      this.wajibs = this.student.wajibs || [];

      console.log(this.student.wajibs);
    } catch (error) {
      console.error('Error updating wajib:', error);
    } finally {
      if (this.wajibs) {
        this.tabulatorTable?.setData(this.wajibs);
      }

      this.loading = false;
    }
  }

  getEducationLevelArabic(level: null | string | undefined): string {
    if (!level) return '-';

    switch (level) {
      case 'primary':
        return 'ابتدائي';
      case 'secondary':
        return 'ثانوي';
      case 'high':
        return 'متوسط';
      case 'university':
        return 'جامعي';
      default:
        return '';
    }
  }
}
