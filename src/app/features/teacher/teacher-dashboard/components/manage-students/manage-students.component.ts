import { Component, inject } from '@angular/core';

import { EnrollmentService } from '../../../../../core/services/enrollments.service';
import { Enrollment } from '../../../../../core/models/Enrollment.model';
import { ActivatedRoute} from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-students',
  imports: [MatCardModule,MatProgressSpinnerModule,MatIconModule],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.css',
})
export class ManageStudentsComponent {
  private enrollmentService = inject(EnrollmentService);

  enrollments!: Enrollment[];
  courseId!: number;

  constructor( private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.route.parent?.params.subscribe(params => {
      this.courseId = Number(params['id']);
      this.getEnrollments();
    });
  }

  getEnrollments() {
    this.enrollmentService
      .getEnrollmentsByCourseId(this.courseId)
      .then((data) => {
        this.enrollments = [...data];        
      });
  }
}
