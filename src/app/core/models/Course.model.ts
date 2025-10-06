import { ClassSession } from "./ClassSession.model";
import { Level } from "./Level.model";
import { User } from "./User.model";

export class Course {
  constructor(
    public id: number | null,
    public level: Level | null,
    public title: string | null,
    public description: string | null,
    public classSessions: ClassSession[] | null = null,
    public teacher: User | null = null,
  ) {}

  static fromApi(data: any): Course {
    return new Course(
      data.id ?? null,
      data.level ? Level.fromApi(data.level) : null,
      data.title ?? null,
      data.description ?? null,
      data.class_sessions?.map((s: any) => ClassSession.fromApi(s)) ?? null,
      data.teacher ? User.fromApi(data.teacher)  : null
    );
  }
  toPayload(): any {
    return {
      id: this.id,
      level_id: this.level?.id,
      title: this.title,
      description: this.description,
      class_sessions: this.classSessions?.map((session) => session.toPayload()) ?? [],
      user_id: this.teacher?.id ?? null,
    };
  }
}
