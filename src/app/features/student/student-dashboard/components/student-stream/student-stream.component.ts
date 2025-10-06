import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';

import { QuillModule } from 'ngx-quill';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CoursesStudentService } from '../../../../../core/services/student-cources.service';
import { Course } from '../../../../../core/models/Course.model';
import { PostService } from '../../../../../core/services/posts.service';
import { Post } from '../../../../../core/models/Post.model';
import { LiveService } from '../../../../../core/services/live.service';

@Component({
  selector: 'app-student-stream',
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    QuillModule,
    FormsModule,
    CommonModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTabsModule,
    RouterModule,
    MatDividerModule
  ],
  templateUrl: './student-stream.component.html',
  styleUrl: './student-stream.component.css'
})
export class StudentStreamComponent {
 
  safePosts: { content: SafeHtml; createdAt: string }[] = [];

  courseService = inject(CoursesStudentService);

  postService = inject(PostService);

  liveService = inject(LiveService);

  courseId!: number;

  course!: Course;

  nextSession: any = null;

  loading = true;

  posts: Post[] = [];

  private _snackBar = inject(MatSnackBar);
  
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) {}



    
    ngOnInit() {
      this.route.parent?.params.subscribe(params => {
        this.courseId = Number(params['id']);
        this.fetchCourse(this.courseId);
        this.fetchPosts();
      });
    }
  



  fetchCourse(id: number) {
    this.courseService
      .fetchCourse(id)
      .then((data) => {
        this.course = data;
  
        console.log('Course fetched:', this.course);
  
        // Find the next closest session
        if (this.course.classSessions && this.course.classSessions.length > 0) {
          const now = new Date();
  
          // Parse and filter sessions to find future ones
          const futureSessions = this.course.classSessions
            .map((session: any) => {
              const sessionStartDate = this.getNextOccurrence(session.startTime);
              const sessionEndDate = this.getNextOccurrence(session.endTime);
  
              return {
                ...session,
                sessionStartDate,
                sessionEndDate,
              };
            })
            .filter((session: any) => session.sessionStartDate > now); // Only future sessions
  
          // Sort future sessions by start date
          futureSessions.sort(
            (a: any, b: any) =>
              a.sessionStartDate.getTime() - b.sessionStartDate.getTime()
          );
  
          // Get the next session
          this.nextSession = futureSessions.length > 0 ? futureSessions[0] : null;
        } else {
          this.nextSession = null;
        }


         // Format sessionStartDate to Arabic locales for display
         if (this.nextSession) {
          this.nextSession.formattedStartDate = new Intl.DateTimeFormat('ar-EG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour12: true,
          }).format(this.nextSession.sessionStartDate);
        }
      
  
        console.log('Next session:', this.nextSession);
      })
      .catch((error) => {
        this.loading = false;
        console.error('Error fetching course:', error);
      });
  }


  getNextOccurrence(dateTime: string): Date {
    const inputDate = new Date(dateTime);
  
    if (isNaN(inputDate.getTime())) {
      throw new Error('Invalid date format. Expected format: YYYY-MM-DD HH:mm:ss');
    }
  
    const now = new Date();
  
    if (inputDate <= now) {
      // If the date/time has already passed, move to the same time next week
      inputDate.setDate(inputDate.getDate() + 7);
    }    
  
    return inputDate;

  }
  
  
  fetchPosts() {
    this.postService
      .getPostsByCourseId(this.courseId)
      .then((data) => {
        this.posts = data.map((post: any) => ({
          ...post,
          content: this.sanitizer.bypassSecurityTrustHtml(post.content),
        }));
        this.loading = false;
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }
  


  downloadFile(filePath:string){
    this.postService
      .downloadFile(filePath)
      .then((response) => {
        
      console.log('File downloaded successfully:', response);
      
      }
      )
      .catch((error) => {
        console.error('Error downloading file:', error);
      }
      );

  }



  joinLiveSession(){
    // this.router.navigate(['/live/courses', this.courseId]);
    this.liveService
      .joinLiveSession()
      .then((response) => {
        console.log('Live session started successfully:', response);
        this._snackBar.open('تم بدء الجلسة بنجاح', 'إغلاق', {
          duration: 3000,
        });
      }
      )
      .catch((error) => { 
        console.error('Error starting live session:', error);
        this._snackBar.open('فشل بدء الجلسة', 'إغلاق', {
          duration: 3000,
        });
      }
      );
  }




}
