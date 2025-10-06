import { ExamQuestion } from "./ExamQuestion.model";
import { ExamQuestionOption } from "./ExamQuestionOption.model";

export class ExamSubmissionAnswer {
  constructor(
    public id: number | null,
    public examSubmissionId: number | null,
    public questionId: number | null,
    public answerText: string | null,
    public optionId: number | null,
    public isCorrect: boolean | null,
    public question: ExamQuestion | null = null,
    public option: ExamQuestionOption | null = null,
  ) {}

  static fromApi(data: any): ExamSubmissionAnswer {
    return new ExamSubmissionAnswer(
      data.id ?? null,
      data.exam_submission_id ?? null,
      data.question_id ?? null,
      data.answer_text ?? null,
      data.option_id ?? null,
      data.is_correct ?? null,
      data.question ? ExamQuestion.fromApi(data.question) : null,
      data.option ? ExamQuestionOption.fromApi(data.option) : null,
    );
  }

  toPayload(): any {
    return {
      id: this.id,
      exam_submission_id: this.examSubmissionId,
      question_id: this.questionId,
      answer_text: this.answerText,
      option_id: this.optionId,
      is_correct: this.isCorrect,
    };
  }
}
