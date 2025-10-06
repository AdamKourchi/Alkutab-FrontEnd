import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './features/teacher/teacher-dashboard/teacher-dashboard.component';
import { AdminDashboardHomePageComponent } from './features/admin/admin-dashboard/components/admin-dashboard-home-page/admin-dashboard-home-page.component';
import { ManagePathsComponent } from './features/admin/admin-dashboard/components/manage-paths/manage-paths.component';
import { ManageTeachersComponent } from './features/admin/admin-dashboard/components/manage-teachers/manage-teachers.component';
import { AcceptInviteComponent } from './features/accept-invite/accept-invite.component';
import { ManageScheduleComponent } from './features/teacher/teacher-dashboard/components/manage-schedule/manage-schedule.component';
import { ManageCoursesComponent } from './features/admin/admin-dashboard/components/manage-courses/manage-courses.component';
import { ManageCourseComponent } from './features/teacher/teacher-dashboard/components/manage-course/manage-course.component';
import { ManageStreamComponent } from './features/teacher/teacher-dashboard/components/manage-stream/manage-stream.component';
import { ManageStudentsComponent } from './features/teacher/teacher-dashboard/components/manage-students/manage-students.component';
import { LiveSessionComponent } from './shared/live-session/live-session.component';
import { RegisterComponent } from './features/register/register.component';
import { StudentDashboardComponent } from './features/student/student-dashboard/student-dashboard.component';
import { StudentScheduleComponent } from './features/student/student-dashboard/components/student-schedule/student-schedule.component';
import { StudentHomeComponent } from './features/student/student-dashboard/components/student-home/student-home.component';
import { StudentProfileComponent } from './features/student/student-dashboard/components/student-profile/student-profile.component';
import { StudentCourseComponent } from './features/student/student-dashboard/components/student-course/student-course.component';
import { StudentStreamComponent } from './features/student/student-dashboard/components/student-stream/student-stream.component';
import { StudentClassworkComponent } from './features/student/student-dashboard/components/student-classwork/student-classwork.component';
import { ManageClassworkComponent } from './features/teacher/teacher-dashboard/components/manage-classwork/manage-classwork.component';
import { ManageExamsComponent } from './features/teacher/teacher-dashboard/components/manage-exams/manage-exams.component';
import { ManageExamsAdminComponent } from './features/admin/admin-dashboard/components/manage-exams-admin/manage-exams-admin.component';
import { StudentExamsComponent } from './features/student/student-dashboard/components/student-exams/student-exams.component';
import { TeacherProfileComponent } from './features/teacher/teacher-dashboard/components/teacher-profile/teacher-profile.component';
import { AdminProfileComponent } from './features/admin/admin-dashboard/components/admin-profile/admin-profile.component';
import { TeacherHomepageComponent } from './features/teacher/teacher-dashboard/components/teacher-homepage/teacher-homepage.component';
import { AdminStudentsComponent } from './features/admin/admin-dashboard/components/admin-students/admin-students.component';
import { StudentCircleComponent } from './features/student/student-dashboard/components/student-circle/student-circle.component';
import { StudentNotebookComponent } from './features/student/student-dashboard/components/student-notebook/student-notebook.component';
import { TeacherCircleComponent } from './features/teacher/teacher-dashboard/components/teacher-circle/teacher-circle.component';
import { TeacherRecordsComponent } from './features/teacher/teacher-dashboard/components/teacher-records/teacher-records.component';
import { TeacherLiveCircleComponent } from './features/teacher/teacher-dashboard/components/teacher-live-circle/teacher-live-circle.component';
import { CircleLiveSessionComponent } from './shared/circle-live-session/circle-live-session.component';
import { StudentLiveCircleComponent } from './features/student/student-dashboard/components/student-live-circle/student-live-circle.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    children: [
      { path: '', component: AdminDashboardHomePageComponent },
      { path: 'paths', component: ManagePathsComponent },
      { path: 'teachers', component: ManageTeachersComponent },
      { path: 'profile', component: AdminProfileComponent },

      { path: 'courses', component: ManageCoursesComponent },
      { path: 'schedule', component: ManageExamsAdminComponent },
      { path: 'students', component: AdminStudentsComponent },



    ],
  },
  {
    path: 'teacher/dashboard',
    component: TeacherDashboardComponent,
    children: [
      { path: '', component: TeacherHomepageComponent },
      { path: 'schedule', component: ManageScheduleComponent },
      { path: 'profile', component: TeacherProfileComponent },
      {
        path: 'courses/:id',
        component: ManageCourseComponent,
        children: [
          { path: '', component: ManageStreamComponent },
          { path: 'classwork', component: ManageClassworkComponent },
          { path: 'exams', component: ManageExamsComponent },
          { path: 'students', component: ManageStudentsComponent },
        ],
      },
       {
        path: 'circles/:id',
        component: TeacherCircleComponent,
        children: [
          { path: '', component: TeacherRecordsComponent },
          { path: 'live', component: TeacherLiveCircleComponent },

        ],
      },
    ],
  },
  {
    path: 'live/session/:roomName/:id',
    component: LiveSessionComponent,
  },
  {
    path: 'liveCircle/:roomName/:id',
    component: CircleLiveSessionComponent,
  },
  {
    path: 'student/dashboard',
    component: StudentDashboardComponent,
    children: [
      { path: '', component: StudentHomeComponent },
      { path: 'schedule', component: StudentScheduleComponent },
      { path: 'profile', component: StudentProfileComponent },
      {
        path: 'courses/:id',
        component: StudentCourseComponent,
        children: [
          { path: '', component: StudentStreamComponent },
          { path: 'classwork', component: StudentClassworkComponent },
          { path: 'exams', component: StudentExamsComponent },

        ],
      },
           {
        path: 'circle/:id',
        component: StudentCircleComponent,
        children: [
          { path: '', component: StudentNotebookComponent },
          { path: 'classwork', component: StudentClassworkComponent },
          { path: 'live', component: StudentLiveCircleComponent },
          

        ],
      },
    ],
  },

  {
    path: 'accept-invite',
    component: AcceptInviteComponent,
  },
];
