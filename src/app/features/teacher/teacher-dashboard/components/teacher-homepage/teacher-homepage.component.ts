import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

interface Stats {
  totalStudents: number;
  totalCourses: number;
  totalLevels: number;
  pendingExams: number;
  completedExams: number;
}

interface CourseProgress {
  name: string;
  students: number;
  progress: number;
}

interface Task {
  title: string;
  type: 'exam' | 'class';
  course: string;
  dueDate: string;
}

interface StudentActivity {
  student: string;
  action: string;
  course: string;
  time: string;
}

@Component({
  selector: 'app-teacher-homepage',
  templateUrl: './teacher-homepage.component.html',
  styleUrls: ['./teacher-homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatListModule,
    MatDividerModule
  ]
})
export class TeacherHomepageComponent implements OnInit {
  stats: Stats = {
    totalStudents: 150,
    totalCourses: 8,
    totalLevels: 3,
    pendingExams: 5,
    completedExams: 12
  };

  courseProgress: CourseProgress[] = [
    { name: 'القرآن الكريم - المستوى الأول', students: 45, progress: 75 },
    { name: 'التجويد - المستوى الثاني', students: 32, progress: 60 },
    { name: 'الفقه - المستوى الأول', students: 28, progress: 85 },
    { name: 'الحديث - المستوى الثالث', students: 20, progress: 40 }
  ];

  upcomingTasks: Task[] = [
    {
      title: 'اختبار نهاية الوحدة',
      type: 'exam',
      course: 'القرآن الكريم - المستوى الأول',
      dueDate: '2024-03-20'
    },
    {
      title: 'حصة تجويد أونلاين',
      type: 'class',
      course: 'التجويد - المستوى الثاني',
      dueDate: '2024-03-18'
    },
    {
      title: 'تقييم أداء الطلاب',
      type: 'exam',
      course: 'الفقه - المستوى الأول',
      dueDate: '2024-03-22'
    }
  ];

  recentStudentActivities: StudentActivity[] = [
    {
      student: 'أحمد محمد',
      action: 'أكمل درس',
      course: 'القرآن الكريم - المستوى الأول',
      time: 'منذ 5 دقائق'
    },
    {
      student: 'سارة أحمد',
      action: 'سلمت الواجب',
      course: 'التجويد - المستوى الثاني',
      time: 'منذ 15 دقيقة'
    },
    {
      student: 'محمد علي',
      action: 'أكمل اختبار',
      course: 'الفقه - المستوى الأول',
      time: 'منذ ساعة'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // TODO: Fetch real data from the backend
  }
}
