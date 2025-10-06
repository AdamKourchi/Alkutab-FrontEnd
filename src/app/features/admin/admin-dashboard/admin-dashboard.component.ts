import { Component, inject, Inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { User } from '../../../core/models/User.model';
import { AuthService } from '../../../core/services/authService.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  links = [
    { name: 'الرئيسية', route: '/admin/dashboard', icon: 'dashboard' },
    { name: 'الملف الشخصي', route: '/admin/dashboard/profile', icon: 'person' },
    { name: 'الأساتذة', route: '/admin/dashboard/teachers', icon: 'school' },
    { name: 'المسارات', route: '/admin/dashboard/paths', icon: 'straight' },
    { name: 'الدورات', route: '/admin/dashboard/courses', icon: 'book' },
    { name: 'الجدول الزمني', route: '/admin/dashboard/schedule', icon: 'calendar_month' },
    { name: 'الطلبة', route: '/admin/dashboard/students', icon: 'group' },



  ];
  opened: boolean = false;
  admin!: User;

  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.authService.fetchUser().then((user) => {
        this.admin = user
    }).catch((error) => {
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

    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Error during logout:', error);
    });
  }
}
