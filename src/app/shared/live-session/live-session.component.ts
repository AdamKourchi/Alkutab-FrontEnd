import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SessionService } from '../../core/services/sessions.service';
import { ClassSession } from '../../core/models/ClassSession.model';
import { PostService } from '../../core/services/posts.service';
import { LiveService } from '../../core/services/live.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { User } from '../../core/models/User.model';
import { AuthService } from '../../core/services/authService.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-live-session',
  imports: [
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './live-session.component.html',
  styleUrls: ['./live-session.component.css'],
})
export class LiveSessionComponent implements OnInit {
  private sessionService = inject(SessionService);
  private postService = inject(PostService);
  private _snackBar = inject(MatSnackBar);
  private liveService = inject(LiveService);
  private authService = inject(AuthService);


  notified: boolean = false;
  loading: boolean = true; // Controls the loading screen
  sessionId!: number;
  session!: ClassSession;
  domain: string = environment.jitsiDomain;
  roomName!: string;
  role!:string;
  user!:User;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = Number(this.route.snapshot.paramMap.get('id'));
    this.getUser();

    // Fetch session and load Jitsi script in parallel
    Promise.all([this.getSession(this.sessionId), this.loadJitsiScript()])
      .then(() => {
        this.startConference();

        // this.loading = false; // Hide the loading screen
      })
      .catch((error) => {
        console.error('Error initializing live session:', error);
      });
  }

  getUser(){
    this.authService.fetchUser().then((data)=>{
      this.user = data;
      this.role = localStorage.getItem("authRole") ?? "undefined";
    })
  }

  getSession(sessionId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sessionService
        .getSessionById(sessionId)
        .then((session) => {
          console.log('Session:', session);
          this.session = session;
          this.roomName = `course_live_${this.sessionId}`;
          resolve();
        })
        .catch((error) => {
          console.error('Error fetching session:', error);
          reject(error);
        });
    });
  }

  loadJitsiScript(): Promise<void> {
    return new Promise((resolve) => {
      const existingScript = document.getElementById('jitsi-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'jitsi-script';
        script.src = `https://${environment.jitsiDomain}/external_api.js`; 
        script.onload = () => resolve();
        document.body.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  startConference(): void {
    const container = document.querySelector('#jitsi-container');

    if (!container) {
      console.error('Jitsi container element is not available in the DOM.');
      return;
    }

    if (!this.session) {
      console.error('Session data is not available.');
      return;
    }

    const options = {
      roomName: this.roomName,
      width: '100%',
      height: 700,
      parentNode: container, // Attach to the container
      configOverwrite: {
        startWithAudioMuted: false,
        disableSimulcast: false,
      },
      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        SHOW_JITSI_WATERMARK: false,
      },
      userInfo: {
        displayName: this.user.name,
      },
    };

    const api = new (window as any).JitsiMeetExternalAPI(this.domain, options);

    // Optional: add event handlers
    api.addEventListener('videoConferenceJoined', () => {
      console.log('Teacher joined the class');
    });

    this.loading = false; // Hide the loading screen
  }

  notifyStudents() {
    const content = `<p class="ql-direction-rtl ql-align-right">السلام&nbsp;عليكم&nbsp;و&nbsp;رحمة&nbsp;الله&nbsp;تعالى&nbsp;و&nbsp;بركاته،&nbsp;الجلسة&nbsp;بدأت&nbsp;المرجو&nbsp;الإنضمام&nbsp;عبر&nbsp;الرابط&nbsp;التالي&nbsp;:&nbsp;</p><p class="ql-direction-rtl ql-align-right"><u style="color: rgb(0, 102, 204);"> <a href="${(this.session.link?.toString() ?? '') +"/"+(this.session.id ?? '')}"> <b>رابط الجلسة</b></a>   </u></p>`;
    if (this.session.courseId !== null) {
      this.postService
        .addRessource(content, this.session.course.id, [])
        .then(() => {
          
          this.notified = true;
          this._snackBar.open('تم إشعار الطلاب بنجاح عبر المنشور', 'إغلاق', {
            duration: 3000,
            });

        })
        .catch((error) => {
            this._snackBar.open('حدث خطأ أثناء إشعار الطلاب', 'إغلاق', {
            duration: 3000,
            });
          console.error('Error:', error);
        });
    } else {
      console.error('Course ID is null. Cannot notify students.');
    }
  }
  endSession(sessionId:number){
    this.liveService.endLive(sessionId).then((data) => {
          
      
      this.router.navigate(['/teacher/dashboard/courses/', this.session.course.id]);

    }
    ).catch((error) => {
      console.error('Error starting live session:', error);
      this._snackBar.open('فشل إنهاء الجلسة', 'إغلاق', {
        duration: 3000,
      });
    }
    );
  }

  navigateToDashboard(){
    this.router.navigate(['/student/dashboard/courses/', this.session.course.id]);
  }
}
