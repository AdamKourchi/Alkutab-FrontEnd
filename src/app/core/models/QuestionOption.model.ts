export class QuestionOption {
    constructor(
      public id: number | null,
      public questionId: number | null,
      public optionText: string | null,
      public isCorrect: boolean = false, // Default to false
    ) {}
  
    // Map API response to QuestionOption object
    static fromApi(data: any): QuestionOption {
      return new QuestionOption(
        data.id ?? null,
        data.question_id ?? null,
        data.option_text ?? null,
        data.is_correct ?? false,
      );
    }
  
    // Prepare QuestionOption object for API payload
    toPayload(): any {
      return {
        question_id: this.questionId,
        option_text: this.optionText,
        is_correct: this.isCorrect,
      };
    }
  }