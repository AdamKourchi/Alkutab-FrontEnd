import { Component, inject } from '@angular/core';
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
  selector: 'app-teacher-dashboard',
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
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css',
})
export class TeacherDashboardComponent {
  links: Array<{
    name: string;
    route: string;
    icon: string;
    expanded?: boolean;
    chlidren?: Array<{ title: string; route: string; icon: string }>;
  }> = [
    { name: 'الرئيسية', route: '/teacher/dashboard', icon: 'dashboard' },
    {
      name: 'الجدول الزمني',
      route: '/teacher/dashboard/schedule',
      icon: 'calendar_month',
    },
    {
      name: 'الملف الشخصي',
      route: '/teacher/dashboard/profile',
      icon: 'person',
    },
  ];

  opened: boolean = false;
  teacher!: User;

  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.authService
      .fetchUser()
      .then((user) => {
        this.teacher = user;

        if (user.circles && user.circles.length > 0) {
          const circleLink = {
            name: 'حلقات الحفظ',
            route: `/teacher/dashboard/circle`,
            icon: 'school',
            expanded: false,
            chlidren: user.circles.map((circle: any) => ({
              title: circle.title,
              route: `/teacher/dashboard/circles/${circle.id}`,
              icon: 'book',
            })),
          };

          this.links = [...this.links, circleLink];

        }

        if (user.courses && user.courses.length > 0) {
          const coursesLink = {
            name: 'الدورات',
            route: '/teacher/dashboard/courses',
            icon: 'school',
            expanded: false,
            chlidren: user.courses.map((course: any) => ({
              title: course.title,
              route: `/teacher/dashboard/courses/${course.id}`,
              icon: 'book',
            })),
          };

          this.links = [...this.links, coursesLink];
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
