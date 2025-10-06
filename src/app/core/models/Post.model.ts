import { File } from "./File.model";
import { Course } from "./Course.model";
import { isObservable } from "rxjs";

export class Post {
  constructor(
    public id: number | null,
    public content: string | null,
    public course : Course | null = null,
    public files: File[] | null = null,
    public createdAt: Date | null = null,
  ) {}

  static fromApi(data: any): Post {
    return new Post(
      data.id ?? null,
      data.content ?? null,
      data.course ? Course.fromApi(data.course) : null,
      data.files?.map((f: any) => File.fromApi(f)) ?? null,
      data.created_at ? data.created_at.toLocaleString() : null,
    );
  }

  toPayload(): any {
    return {
      id: this.id,
      content: this.content,
      course_id : this.course?.id ?? null,
      createdAt: this.createdAt,

    };
  }
}
