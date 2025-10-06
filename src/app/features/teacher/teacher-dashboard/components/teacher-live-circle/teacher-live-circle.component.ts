import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { Circle } from '../../../../../core/models/Circle.model';
import { LiveService } from '../../../../../core/services/live.service';

@Component({
  selector: 'app-teacher-live-circle',
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    
],
  templateUrl: './teacher-live-circle.component.html',
  styleUrl: './teacher-live-circle.component.css',
})
export class TeacherLiveCircleComponent {
  liveService = inject(LiveService);

  storedUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  circleId!: number;
  circle: Circle | null = null;
  nextSessionDate: string = '';
  formattedDate: string = 'لا شيء';

  constructor(private route: ActivatedRoute, private dialog: MatDialog ,private router: Router) {} 
    

  ngOnInit() {
    this.route.parent?.params.subscribe((params) => {
      this.circleId = Number(params['id']);
      this.circle =
        this.storedUser?.circles?.find((c: Circle) => c.id === this.circleId) ||
        null;

      if (this.circle) {
        const nextSession = this.getNextDay(this.circle);

        this.nextSessionDate = nextSession
          ? nextSession.toLocaleString()
          : 'No upcoming sessions';

        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long', // "الاثنين"
          year: 'numeric', // "2025"
          month: 'long', // "أكتوبر"
          day: 'numeric', // "6"
          hour: '2-digit',
          minute: '2-digit',
          hour12: false, // 24-hour format
        };

        const formatted = new Intl.DateTimeFormat('ar-MA', options).format(
          nextSession?.getTime()
        );

        this.formattedDate = formatted;
      }
    });
  }

  nextWeekday(day: number, from: Date = new Date()): Date {
    const result = new Date(from);
    const currentDay = result.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const diff = (day + 7 - currentDay) % 7 || 7;
    result.setDate(result.getDate() + diff);
    return result;
  }

  getNextSession(circle: any, fromDate: Date = new Date()) {
    console.log('NEXT SESSION CALCULATING ......');

    const daysOfWeek: number[] = JSON.parse(circle.days_of_week);

    let candidate = new Date(fromDate);

    const baseStart = new Date(circle.start_time);
    const targetHour = baseStart.getHours();
    const targetMinute = baseStart.getMinutes();

    const day = candidate.getDay();
    console.log(day);

    if (daysOfWeek.includes(day)) {
      const sessionDate = new Date(candidate);
      sessionDate.setHours(targetHour, targetMinute, 0, 0);

      // Must be in the future
      if (sessionDate > fromDate) {
        console.log('sessionDate', sessionDate);
        return sessionDate;
      } else {
        const sessionDate = this.nextWeekday(day);
        sessionDate.setHours(targetHour, targetMinute, 0, 0);

        console.log('sessionDate', sessionDate);
        return sessionDate;
      }
    }

    for (let i = day + 1; i < 7; i++) {
      if (daysOfWeek.includes(i)) {
        const sessionDate = this.nextWeekday(i);
        sessionDate.setHours(targetHour, targetMinute, 0, 0);

        console.log('sessionDate', sessionDate);
        return sessionDate;
      }
    }

    for (let i = day - 1; i > -1; i--) {
      if (daysOfWeek.includes(i)) {
        const sessionDate = this.nextWeekday(i);
        sessionDate.setHours(targetHour, targetMinute, 0, 0);

        console.log('sessionDate', sessionDate);
        return sessionDate;
      }
    }

    return null;
  }
  
  getNextDay(circle: any, fromDate: Date = new Date()) {
    let availableDays: number[] = JSON.parse(circle.days_of_week);

    const today = new Date().getDay();
    availableDays = [...availableDays].sort((a, b) => a - b);

    let closest: number | null = null;
    let minDiff = 7;

    for (const day of availableDays) {
      let diff = (day - today + 7) % 7;

      if (diff === 0) {
        diff = 7;
      }

      if (diff < minDiff) {
        minDiff = diff;
        closest = day;
      }
    }

    const baseStart = new Date(circle.start_time);
    const targetHour = baseStart.getHours();
    const targetMinute = baseStart.getMinutes();

    const sessionDate = this.nextWeekday(closest!);
    sessionDate.setHours(targetHour, targetMinute, 0, 0);

    console.log('sessionDate', sessionDate);
    return sessionDate;
  }


  startLiveCircle() {
    this.liveService
      .startLiveCircle(this.circle?.id)
      .then((data) => {
        this.router.navigate(['/liveCircle/', data, this.circle?.id]);
      })
      .catch((error) => {
        console.error('Error starting live circle:', error);
      });
  }
}
