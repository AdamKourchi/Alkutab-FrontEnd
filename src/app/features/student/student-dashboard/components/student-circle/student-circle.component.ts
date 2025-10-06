import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-student-circle',
  imports: [
    FormsModule,
    CommonModule,
    MatTabsModule,
    RouterModule,
  ],  templateUrl: './student-circle.component.html',
  styleUrl: './student-circle.component.css'
})
export class StudentCircleComponent {

  circleId!: number;

  links: any[] = [];

  activeLink !: string;

  tabPanel: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.circleId = params['id'];
    });


    this.links = [
      { name: 'الكراسة', route: `/student/dashboard/circle/${this.circleId}` },
      {
        name: 'الحصة المباشرة',
        route: `/student/dashboard/circle/${this.circleId}/live`,
      },
      //     {
      //   name: 'السماع',
      //   route: `/student/dashboard/circle/${this.circleId}/hearing`,
      // },
    
    ];

    this.activeLink = this.links[0].route;
  }

  navigateTo(link: any) {
    this.activeLink = link;

    this.router.navigate([link]);
  }
}
