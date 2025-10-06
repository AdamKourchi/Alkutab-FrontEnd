export class ExamQuestionOption {
    constructor(
      public id: number | null,
      public examQuestionId: number | null,
      public optionText: string | null,
    ) {}
  
    static fromApi(data: any): ExamQuestionOption {
      return new ExamQuestionOption(
        data.id ?? null,
        data.exam_question_id ?? null,
        data.option_text ?? null,
      );
    }
  
    toPayload(): any {
      return {
        id: this.id,
        exam_question_id: this.examQuestionId,
        option_text: this.optionText,
      };
    }
  }
  