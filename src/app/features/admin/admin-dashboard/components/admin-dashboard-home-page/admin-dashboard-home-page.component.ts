import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-dashboard-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './admin-dashboard-home-page.component.html',
  styleUrl: './admin-dashboard-home-page.component.css'
})
export class AdminDashboardHomePageComponent implements OnInit {
  // Mock data - Replace with actual API calls
  stats = {
    totalStudents: 150,
    totalTeachers: 12,
    totalPaths: 5,
    totalLevels: 15,
    totalCourses: 45,
    activeStudents: 120,
    activeTeachers: 10
  };

  recentActivities = [
    { type: 'student', action: 'انضم', name: 'أحمد محمد', time: 'منذ 5 دقائق' },
    { type: 'teacher', action: 'أضاف', name: 'دورة جديدة', time: 'منذ ساعة' },
    { type: 'student', action: 'أكمل', name: 'مستوى جديد', time: 'منذ ساعتين' },
    { type: 'teacher', action: 'قام بتصحيح', name: 'اختبار', time: 'منذ 3 ساعات' }
  ];

  pathsProgress = [
    { name: 'المسار الأول', progress: 75, students: 45 },
    { name: 'المسار الثاني', progress: 60, students: 38 },
    { name: 'المسار الثالث', progress: 45, students: 30 },
    { name: 'المسار الرابع', progress: 30, students: 25 },
    { name: 'المسار الخامس', progress: 15, students: 12 }
  ];

  ngOnInit() {
    // TODO: Fetch actual data from your API
  }
}
