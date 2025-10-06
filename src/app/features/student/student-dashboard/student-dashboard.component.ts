import { Component, inject, Inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';

import { User } from '../../../core/models/User.model';
import { AuthService } from '../../../core/services/authService.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    MatDividerModule,
    MatTreeModule,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent {
  links: Array<{
    name: string;
    route: string;
    icon: string;
    expanded?: boolean;
    chlidren?: Array<{ title: string; route: string; icon: string }>;
  }> = [
    { name: 'الرئيسية', route: '/student/dashboard', icon: 'dashboard' },
    {
      name: 'الجدول الزمني',
      route: '/student/dashboard/schedule',
      icon: 'calendar_month',
    },
    {
      name: 'الملف الشخصي',
      route: '/student/dashboard/profile',
      icon: 'person',
    },
  ];

  opened: boolean = false;
  student!:   User;

  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.authService
      .fetchUser()
      .then((user) => {
        this.student = user;

        console.log('Fetched user:', user);

        if (user.courses && user.courses.length > 0) {
          const coursesLink = {
            name: 'الدورات',
            route: '/student/dashboard/courses',
            icon: 'school',
            expanded: false,
            chlidren: user.courses.map((course: any) => ({
              title: course.title,
              route: `/student/dashboard/courses/${course.id}`,
              icon: 'book',
            })),
          };
          this.links = [...this.links, coursesLink];

          this.links[3].chlidren = user.courses.map((course: any) => ({
            title: course.title,
            route: `/student/dashboard/courses/${course.id}`,
            icon: 'book',
          }));
        }

        if (user.circle && user.circle.id) {
          const circleLink = {
            name: 'حلقة الحفظ',
            route: `/student/dashboard/circle/${user.circle.id}`,
            icon: 'school',
          };
          this.links = [...this.links, circleLink];
          console.log(this.links);
        }

      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }

  navigateTo(link: any) {
    this.router.navigate([link.route]);
  }

  toggleSidenav() {
    this.opened = !this.opened;
  }

  logout() {
    this.authService
      .logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  }
}
