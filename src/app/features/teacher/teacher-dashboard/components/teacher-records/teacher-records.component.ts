import { Component, inject, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { TabulatorTableComponent } from '../../../../../shared/tabulator-table/tabulator-table.component';
import { AddWajibDialogComponent } from '../add-wajib-dialog/add-wajib-dialog.component';
import { WajibService } from '../../../../../core/services/wajib.service';
import { Circle } from '../../../../../core/models/Circle.model';
import { User } from '../../../../../core/models/User.model';
import { StudentsService } from '../../../../../core/services/students.service';

@Component({
  selector: 'app-teacher-records',
  standalone: true,
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
  templateUrl: './teacher-records.component.html',
  styleUrl: './teacher-records.component.css',
})
export class TeacherRecordsComponent {
  @ViewChild(TabulatorTableComponent) tabulatorTable?: TabulatorTableComponent;

  @Input() circleIdInput?: number;
  @Input() circleInput?: Circle;

  private studentService = inject(StudentsService);
  private wajibService = inject(WajibService);

  circleId!: number;
  circle: Circle | null = null;
  students: User[] = [];
  selectedStudentIndex: number = 0;
  wajibs: any[] = [];
  loading: boolean = true;

  storedUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  collums = [
    {
      title: 'التاريخ',
      field: 'due_date',
      headerSort: false,
      hozAlign: 'center',
      editor: 'input',
      editorParams: { elementAttributes: { type: 'date' } },
      width: 150,
    },

    { title: 'السورة', field: 'surat', headerSort: false, hozAlign: 'center' },
    {
      title: 'من الآية',
      field: 'from_aya',
      headerSort: false,
      hozAlign: 'center',
    },
    {
      title: 'إلى الآية',
      field: 'to_aya',
      headerSort: false,
      hozAlign: 'center',
    },
    {
      title: 'التقدير',
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
      editor: 'list',
      editorParams: {
        values: {
          vg: 'جيد جدا',
          g: 'جيد',
          p: 'حسن',
          r: 'إعادة',
        },
      },
      headerSort: false,
      hozAlign: 'center',
    },
  ];

  options = {
    layout: 'fitDataFill',
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
    rowContextMenu: [
      {
        label: 'حذف 🗑️',
        action: (e: any, row: any) => {
          this.onDeleteWajib(row.getData());
        },
      },
    ],
  };

  constructor(private route: ActivatedRoute, private dialog: MatDialog) {}

  get selectedStudent(): User | undefined {
    return this.students[this.selectedStudentIndex];
  }

  ngOnInit() {
    if (this.circleIdInput && this.circleInput) {
      this.circleId = this.circleIdInput;
      this.circle = this.circleInput;
      this.getStudentsWithRecords();
      this.refreshTable();
    } else {
      this.route.parent?.params.subscribe((params) => {
        this.circleId = Number(params['id']);
        this.circle =
          this.storedUser?.circles?.find(
            (c: Circle) => c.id === this.circleId
          ) || null;
        this.getStudentsWithRecords();
        this.refreshTable();
      });
    }
  }

  refreshTable() {
    this.tabulatorTable?.setData(this.wajibs);

    const pageSize = this.options.paginationSize || 10;
    const totalPages = Math.ceil(this.wajibs.length / pageSize);

    if (this.tabulatorTable && totalPages > 0) {
      this.tabulatorTable.setPage(totalPages);
    }
  }

  getStudentsWithRecords() {
    this.loading = true;
    this.studentService
      .getStudentsByCircleId(this.circleId)
      .then((data) => {
        this.students = [...data];
        console.log(this.students);

        this.selectedStudentIndex = 0;
        this.wajibs = this.selectedStudent?.wajibs || [];
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        this.loading = false;
      });
  }

  selectStudent(index: number) {
    this.selectedStudentIndex = index;
    this.wajibs = this.selectedStudent?.wajibs || [];
  }

  openAddWajibDialog() {
    const dialogRef = this.dialog.open(AddWajibDialogComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.wajibService
          .createWajib(result, this.selectedStudent)
          .then((data) => {
            this.wajibs.push(data);
            this.refreshTable();
            console.log('Wajib created:', data);
          })
          .catch((error) => {
            console.error('Error creating wajib:', error);
          });
      }
    });
  }

  onCellEdited(cell: any) {
    const updatedRow = cell.getRow().getData();
    this.onUpdateWajib(updatedRow);
  }

  async onUpdateWajib(updatedWajib: any) {
    try {
      // Send update API request
      await this.wajibService.updateWajib(updatedWajib);

      // If mark is 'r', create a new wajib for next day
      if (updatedWajib.mark === 'r') {
        const nextDate = new Date(updatedWajib.due_date);
        nextDate.setDate(nextDate.getDate() + 1);
        const newWajib = {
          ...updatedWajib,
          due_date: nextDate.toISOString().split('T')[0],
          mark: null,
        };
        const createdNewWajib = await this.wajibService.createWajib(
          newWajib,
          this.selectedStudent
        );
        this.wajibs.push(createdNewWajib);
        this.refreshTable();
      }
    } catch (error) {
      console.error('Error updating wajib:', error);
    }
  }

  async onDeleteWajib(wajib: any) {
    try {
      await this.wajibService.deleteWajib(wajib.id);
      this.wajibs = this.wajibs.filter((w) => w.id !== wajib.id);
      this.refreshTable();
    } catch (error) {
      console.error('Error deleting wajib:', error);
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
