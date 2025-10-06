import { Question } from "./Question.model";
import { User } from "./User.model";

export class Answer {
  constructor(
    public id: number | null,
    public student: User | null, // Reference to the user who submitted the answer
    public question: Question | null, // Reference to the related question
    public answerText: string | null, // The actual answer (text or serialized MC choice(s))
    public teacherComment: string | null, // Optional teacher comment
    public score: number | null, // Score out of 100 or any other scale
    public createdAt: string | null, // ISO string for timestamps
    public updatedAt: string | null // ISO string for timestamps
  ) {}

  // Map API response to Answer object
  static fromApi(data: any): Answer {
    return new Answer(
      data.id ?? null,
      data.student ? User.fromApi(data.student) : null, // Map user data
      data.question ? Question.fromApi(data.question) : null, // Map question data
      data.answer ?? null,
      data.teacher_comment ?? null,
      data.score ?? null,
      data.created_at ?? null,
      data.updated_at ?? null
    );
  }

  // Prepare Answer object for API payload
  toPayload(): any {
    return {
      user_id: this.student?.id,
      question_id: this.question?.id,
      answer: this.answerText,
      teacher_comment: this.teacherComment,
      score: this.score,
    };
  }
}