import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { LiveService } from '../../core/services/live.service';
import { Circle } from '../../core/models/Circle.model';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { TeacherRecordsComponent } from '../../features/teacher/teacher-dashboard/components/teacher-records/teacher-records.component';

@Component({
  selector: 'app-circle-live-session',
  imports: [
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatListModule,
  ],
  templateUrl: './circle-live-session.component.html',
  styleUrl: './circle-live-session.component.css',
})
export class CircleLiveSessionComponent {
  private liveService = inject(LiveService);
  circle!: Circle;
  circleId!: number;
  loading: boolean = true;
  domain: string = environment.jitsiDomain;
  roomName!: string;
  role = localStorage.getItem('authRole') || '';
  user = JSON.parse(localStorage.getItem('authUser') || '{}');

  private jitsiApi: any = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  private _bottomSheet = inject(MatBottomSheet);

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheet, {
      panelClass: 'custom-bottom-sheet',
      data: {
        circleId: this.circleId,
        circle: this.circle,
        user: this.user,
      },
    });
  }

  ngOnInit(): void {
    this.circleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.role === 'teacher') {
      this.circle = this.user.circles.find(
        (c: Circle) => c.id === this.circleId
      );
    } else {
      this.circle = this.user.circle;
    }

    console.log(this.circle);

    Promise.all([this.loadJitsiScript()])
      .then(() => {
        this.startConference();
        // this.loading = false; // Hide the loading screen
      })
      .catch((error) => {
        console.error('Error initializing live session:', error);
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
    if (!this.circle) {
      console.error('Session data is not available.');
      return;
    }

    const isModerator = this.role === 'teacher';

    const options = {
      roomName: this.circle.title,
      width: '100%',
      height: '100%',
      parentNode: container,
      configOverwrite: {
        defaultLanguage: 'ar',
        startWithAudioMuted: false,
        disableSimulcast: false,
        prejoinConfig: {
          enabled: true,
          hideDisplayName: true,
        },
        // Breakout rooms configuration
        breakoutRooms: {
          hideAddRoomButton: !isModerator, 
          hideAutoAssignButton: !isModerator,
          hideJoinRoomButton: !isModerator, 
        },
        // Hide invite button for non-moderators
        toolbarButtons: isModerator
          ? undefined
          : [
              'camera',
              'chat',
              'closedcaptions',
              'desktop',
              'download',
              'embedmeeting',
              'etherpad',
              'feedback',
              'filmstrip',
              'fullscreen',
              'hangup',
              'help',
              'highlight',
              'microphone',
              'noisesuppression',
              'participants-pane',
              'profile',
              'raisehand',
              'recording',
              'security',
              'select-background',
              'settings',
              'shareaudio',
              'sharedvideo',
              'shortcuts',
              'stats',
              'tileview',
              'toggle-camera',
              'videoquality',
              'whiteboard',
            ],
      },
      interfaceConfigOverwrite: {
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        SHOW_JITSI_WATERMARK: false,
      },
      userInfo: {
        displayName: this.user.name,

        ...(isModerator && { moderator: true }),
      },
    };

    const api = new (window as any).JitsiMeetExternalAPI(this.domain, options);

    api.addEventListener('videoConferenceJoined', () => {
      console.log('User joined the conference');

      if (isModerator) {
        // Grant moderator rights
        api.executeCommand('toggleLobby', true); 
      }
    });

    // This only triggers when the main conference is actually closed
    api.addEventListener('readyToClose', () => {
      console.log('Conference fully ended - user closed the window/tab');
      this.role === 'teacher'
        ? this.endLiveCircle()
        : this.navigateToDashboard();
    });


    this.loading = false;
  }

  kickParticipant(participantId: string): void {
    if (this.jitsiApi && this.role === 'teacher') {
      this.jitsiApi.executeCommand('kickParticipant', participantId);
      console.log('Kicked participant:', participantId);
    }
  }

  endLiveCircle() {
    this.liveService
      .endLiveCircle(this.circleId)
      .then(() => {
        this.router.navigate([
          '/teacher/dashboard/circles/' + this.circleId + '/live',
        ]);
      })
      .catch((error) => {
        console.error('Error starting live circle:', error);
      });
  }

  navigateToDashboard() {
    this.router.navigate([`/student/dashboard/circle/${this.circle.id}/live/`]);
  }
}

@Component({
  selector: 'bottom-sheet',
  imports: [TeacherRecordsComponent],
  templateUrl: 'bottom-sheet.html',
})
export class BottomSheet {
  private _bottomSheetRef =
    inject<MatBottomSheetRef<BottomSheet>>(MatBottomSheetRef);
  data = inject(MAT_BOTTOM_SHEET_DATA);

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
