import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-manage-course',
  imports: [FormsModule, CommonModule, RouterModule, MatTabsModule],
  templateUrl: './manage-course.component.html',
  styleUrl: './manage-course.component.css',
})
export class ManageCourseComponent {
  courseId!: number;

  links: any[] = [];

  activeLink!: string;

  tabPanel: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.courseId = Number(params['id']);
      this.activeLink = this.router.url;
      this.links = [
        { name: 'الركن', route: `/teacher/dashboard/courses/${this.courseId}` },
        {
          name: 'الواجبات',
          route: `/teacher/dashboard/courses/${this.courseId}/classwork`,
        },
        {
          name: 'الإختبارات',
          route: `/teacher/dashboard/courses/${this.courseId}/exams`,
        },
        {
          name: 'الطلبة',
          route: `/teacher/dashboard/courses/${this.courseId}/students`,
        },
      ];
    });
  }

  navigateTo(link: any) {
    this.activeLink = link;

    this.router.navigate([link]);
  }
}
