import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-student-course',
  imports: [
    FormsModule,
    CommonModule,
    MatTabsModule,
    RouterModule,
  ],
  templateUrl: './student-course.component.html',
  styleUrl: './student-course.component.css'
})
export class StudentCourseComponent {

  courseId!: number;

  links: any[] = [];

  activeLink !: string;

  tabPanel: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseId = params['id'];
    });


    this.links = [
      { name: 'الركن', route: `/student/dashboard/courses/${this.courseId}` },
      {
        name: 'الواجبات',
        route: `/student/dashboard/courses/${this.courseId}/classwork`,
      },
      {
        name: 'الاختبارات',
        route: `/student/dashboard/courses/${this.courseId}/exams`,
      },
    ];

    this.activeLink = this.links[0].route;
  }

  navigateTo(link: any) {
    this.activeLink = link;

    this.router.navigate([link]);
  }
}
