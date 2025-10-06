import { Answer } from "./Answer.model";
import { Course } from "./Course.model";
import { QuestionOption } from "./QuestionOption.model";

export class Question {
    constructor(
      public id: number | null,
      public course: Course | null,
      public questionText: string | null,
      public dueDate: string | null|Date,
      public instructions: string | null,
      public attachment: string | null,
      public questionType: 'text' | 'mc' | null,
      public options: QuestionOption[] = [],
      public answers: Answer[] = [] 

    ) {}
  
    // Map API response to Question object
    static fromApi(data: any): Question {
      return new Question(
        data.id ?? null,
        data.course ? Course.fromApi(data.course) : null,
        data.question_text ?? null,
        data.due_date ? new Date(data.due_date) : null,
        data.instructions ?? null,
        data.attachment ?? null,
        data.question_type ?? null,
        data.options ? data.question_options.map((option: any) => QuestionOption.fromApi(option)) : [],
        data.answers ? data.answers.map((answer: any) => Answer.fromApi(answer)) : []
      );
    }
  
    // Prepare Question object for API payload
    toPayload(): any {
      return {
        course: this.course?.toPayload(),
        question_text: this.questionText,
        instructions: this.instructions,
        due_date: this.dueDate,
        attachment: this.attachment,
        question_type: this.questionType,
        options: this.options.map((option) => option.toPayload()), 
        answers: this.answers.map((answer) => answer.toPayload()), 

      };
    }
  }