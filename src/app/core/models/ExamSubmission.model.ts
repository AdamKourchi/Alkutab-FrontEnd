import { User } from "./User.model";
import { Exam } from "./Exam.model";
import { ExamSubmissionAnswer } from "./ExamSubmissionAnswer.model";

export class ExamSubmission {
  constructor(
    public id: number | null,
    public studentId: number | null,
    public examId: number | null,
    public teacherComment: string | null,
    public score: number | null,
    public student: User | null = null,
    public exam: Exam | null = null,
    public answers: ExamSubmissionAnswer[] | null = null,
  ) {}

  static fromApi(data: any): ExamSubmission {
    return new ExamSubmission(
      data.id ?? null,
      data.student_id ?? null,
      data.exam_id ?? null,
      data.teacher_comment ?? null,
      data.score ?? null,
      data.student ? User.fromApi(data.student) : null,
      data.exam ? Exam.fromApi(data.exam) : null,
      data.exam_submission_answers?.map((a: any) => ExamSubmissionAnswer.fromApi(a)) ?? null,
    );
  }

  toPayload(): any {
    return {
      id: this.id,
      student_id: this.studentId,
      exam_id: this.examId,
      teacher_comment: this.teacherComment,
      score: this.score,
      exam_submission_answers: this.answers?.map(a => a.toPayload()) ?? [],
    };
  }
}
