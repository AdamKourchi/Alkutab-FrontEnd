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

import { CoursesTeacherService } from '../../../../../core/services/teacher-courses.service';
import { Course } from '../../../../../core/models/Course.model';
import Quill from 'quill';
import { PostService } from '../../../../../core/services/posts.service';
import { Post } from '../../../../../core/models/Post.model';
import { LiveService } from '../../../../../core/services/live.service';


@Component({
  selector: 'app-manage-stream',
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
  templateUrl: './manage-stream.component.html',
  styleUrl: './manage-stream.component.css'
})
export class ManageStreamComponent {

  safePosts: { content: SafeHtml; createdAt: string }[] = [];

  courseService = inject(CoursesTeacherService);

  postService = inject(PostService);

  liveService = inject(LiveService);

  courseId!: number;

  course!: Course;

  nextSession: any = null;

  loading = true;

  postContent: string = '';

  selectedFiles: File[] = [];

  posts: Post[] = [];

  private _snackBar = inject(MatSnackBar);
  
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) {}

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
    ],
  };

  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.courseId = Number(params['id']);
      this.fetchCourse(this.courseId);
      this.fetchPosts();
    });



  }

  onEditorCreated(editor: Quill) {
    editor.format('direction', 'rtl');
    editor.format('align', 'right');
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
  

  onFilesSelected(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files) {
      this.selectedFiles = Array.from(target.files); // Store the files
    }
  }

  removeFile(file: File) {
    const index = this.selectedFiles.indexOf(file);
    if (index >= 0) {
      this.selectedFiles.splice(index, 1);
    }
  }

  onSubmit() {
    if (!this.postContent.trim()) {
      this._snackBar.open('يرجى ملء محتوى المشاركة بشكل صحيح', 'إغلاق', {
      duration: 3000,
      });
      return;
    }

    this.postService
      .addRessource(this.postContent, this.courseId, this.selectedFiles)
      .then((response) => {

      // Clear the Quill editor and selected files
      this.postContent = '';
      this.selectedFiles = [];

      // Show confirmation snackbar in Arabic
      this._snackBar.open('تمت المشاركة بنجاح', 'إغلاق', {
        duration: 3000,
      });

      // Fetch posts again
      this.fetchPosts();
      })
      .catch((error) => {
      console.error('Error adding ressource:', error);
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

  deletePost(id: number) {    
    this.postService
      .deletePost(id)
      .then((response) => {
        console.log('Post deleted successfully:', response);
        this.fetchPosts();
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  }

  startLiveSession(){
    // this.router.navigate(['/live/courses', this.courseId]);
    this.liveService
      .startLiveSession()
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


  startGroupChatByCourseId(nextSessionId: number){

    this.liveService.startLive(nextSessionId).then((data) => {
          
      
      this.router.navigate(['/live/session/',data,this.nextSession.id]);

    }
    ).catch((error) => {
      console.error('Error starting live session:', error);
      this._snackBar.open('فشل بدء الجلسة', 'إغلاق', {
        duration: 3000,
      });
    }
    );

  }

}





