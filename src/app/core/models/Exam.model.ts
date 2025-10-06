import { Course } from "./Course.model";
import { ExamQuestion } from "./ExamQuestion.model";

export class Exam {
  constructor(
    public id: number | null,
    public course: Course | null,
    public examType: 'written' | 'oral' | null,
    public title: string | null,
    public description: string | null,
    public isFinal: boolean | null,
    public duration: number | null,
    public instructions: string | null,
    public status: 'submited' | 'dated' | null,
    public startTime: string | null,
    public endTime: string | null,

    public questions: ExamQuestion[] | null = null,
  ) {}

  static fromApi(data: any): Exam {
    return new Exam(
      data.id ?? null,
      data.course ?? null,
      data.exam_type ?? null,
      data.title ?? null,
      data.description ?? null,
      data.is_final === 1,
      data.duration ?? null,
      data.instructions ?? null,
      data.status ?? null,
      data.start_time ?? null,
      data.end_time ?? null,

      data.questions?.map((q: any) => ExamQuestion.fromApi(q)) ?? null,
    );
  }

  toPayload(): any {
    return {
      id: this.id,
      course: this.course?.toPayload(),
      exam_type: this.examType,
      title: this.title,
      description: this.description,
      is_final: this.isFinal ? 1 : 0,
      duration: this.duration,
      instructions: this.instructions,
      status: this.status,
      start_time: this.startTime,
      end_time: this.endTime,
      questions: this.questions?.map((q) => q.toPayload()) ?? [],
    };
  }
}
