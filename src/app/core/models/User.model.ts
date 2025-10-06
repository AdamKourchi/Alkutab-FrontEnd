import { Enrollment } from './Enrollment.model';
import { Course } from './Course.model';
import { ExamSubmission } from './ExamSubmission.model';
import { EnrollmentRequest } from './EnrollmentRequest.model';
import { Circle } from './Circle.model';

export class User {
  constructor(
    public id: number | null,
    public name: string | null,
    public email: string | null,
    public phone: string | null,
    public inviteToken?: string | null,
    public inviteTokenExpiration?: Date | null,
    public enrollments?: Enrollment[] | null,
    public enrollmentRequests? : EnrollmentRequest[] | null,
    public courses?: Course[] | null,
    public examSubmissions?: ExamSubmission[] | null,
    public record?: any[] | null, 
    public wajibs?: any[] | null,
    public circle : Circle | null = null,  

  ) {}

  static fromApi(data: any): User {
    return new User(
      data.id ?? null,
      data.name ?? null,
      data.email ?? null,
      data.phone ?? null,
      data.invite_token ?? null,
      data.invite_expires_at
        ? new Date(data.invite_expires_at)
        : null,
      data.enrollments?.map((enrollment: any) =>
        Enrollment.fromApi(enrollment)
      ) ?? null,
      data.enrollment_requests?.map((request: any) =>
        EnrollmentRequest.fromApi(request)
      ) ?? null,
      data.courses?.map((course: any) =>
        Course.fromApi(course)
      ) ?? null,
      data.exam_submissions?.map((submission: any) =>
        ExamSubmission.fromApi(submission)
      ) ?? null,
      data.record ?? null,
      data.wajibs ?? null,
      data.circle ? Circle.fromApi(data.circle) : null,

    );
  }

  toPayload(): any {
    return {
      id : this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      inviteToken: this.inviteToken,
      inviteTokenExpiration: this.inviteTokenExpiration
        ? this.inviteTokenExpiration.toISOString()
        : null,
      enrollments: this.enrollments?.map((enrollment) => enrollment.id) ?? [],
      courses: this.courses?.map((course) => course.id) ?? [],
      exam_submissions: this.examSubmissions?.map((submission) => submission.id) ?? [],

    };
  }
}
