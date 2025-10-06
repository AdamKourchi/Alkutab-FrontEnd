import { Path } from './Path.model';
import { User } from './User.model';

export class Circle {
  constructor(
    public id: number | null,
    public title: string,
    public path: Path | null,
    public teacher: User | null = null,
    public daysOfWeek: number[] = [],
    public status : string = "offline",
    public link:string,
    public startTime: string | null = null,
    public endTime: string | null = null,
  ) {}

  static fromApi(data: any): Circle {
    
    return new Circle(
      data.id ?? null,
      data.title ?? '',
      data.path ? Path.fromApi(data.path) : null,
      data.teacher ? User.fromApi(data.teacher) : null,
      data.days_of_week ?? [],
      data.status ?? "offline",
      data.link ?? "",
      data.start_time ?? null,
      data.end_time ?? null,

    );
  }

  toPayload(): any {
    return {
      id: this.id,
      title: this.title,
      path_id: this.path?.id,
      user_id: this.teacher?.id
      , days_of_week: this.daysOfWeek,
      link: this.link,

        
      start_time: this.startTime,
      end_time: this.endTime,
    };
  }
} 