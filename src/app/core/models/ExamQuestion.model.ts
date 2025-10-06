import { ExamQuestionOption } from "./ExamQuestionOption.model";

export class ExamQuestion {
  constructor(
    public id: number | null,
    public examId: number | null,
    public type: 'multiple_choice' | 'short_answer' | 'text' | null,
    public question: string | null,
    public correctAnswer: string | null,
    public options: ExamQuestionOption[] | null = null,
  ) {}

  static fromApi(data: any): ExamQuestion {
    return new ExamQuestion(
      data.id ?? null,
      data.exam_id ?? null,
      data.type ?? null,
      data.question ?? null,
      data.correct_answer ?? null,
      data.options?.map((opt: any) => ExamQuestionOption.fromApi(opt)) ?? null,
    );
  }

  toPayload(): any {
    return {
      id: this.id,
      exam_id: this.examId,
      type: this.type,
      question: this.question,
      correct_answer: this.correctAnswer,
      options: this.options?.map((o) => o.toPayload()) ?? [],
    };
  }
}
