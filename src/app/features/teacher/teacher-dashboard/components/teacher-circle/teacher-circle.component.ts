import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-teacher-circle',
  imports: [
    FormsModule,
    CommonModule,
    MatTabsModule,
    RouterModule,
  ],
  templateUrl: './teacher-circle.component.html',
  styleUrl: './teacher-circle.component.css'
})
export class TeacherCircleComponent {

  circleId!: number;

  links: any[] = [];

  activeLink !: string;

  tabPanel: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.circleId = params['id'];
      
    this.links = [
      { name: 'الكراسات', route: `/teacher/dashboard/circles/${this.circleId}` },
      {
        name: 'الحصة المباشرة',
        route: `/teacher/dashboard/circles/${this.circleId}/live`,
      },
    ];

    this.activeLink = this.links[0].route;
    });


  }

  navigateTo(link: any) {
    this.activeLink = link;

    this.router.navigate([link]);
  }



}
