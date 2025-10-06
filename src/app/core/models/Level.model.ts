import { Course } from './Course.model';
import { Path } from './Path.model';

export class Level {

  constructor(
    public id: number | null,
    public path: Path | null,
    public name: string | null,
    public startAt: string | null|Date,
    public endAt: string | null|Date,
    public durationMonths: number | null,
    public description: string | null,
    public order: number | null,
    public courses: Course[] | null = null
  ) {}



  static fromApi(data: any): Level {
    return new Level(
      data.id ?? null,
      data.path ? Path.fromApi(data.path) : null,
      data.name ?? null,
      data.start_at ? new Date(data.start_at) : null,
      data.end_at ? new Date(data.end_at) : null,
      data.duration_months ?? null,
      data.description ?? null,
      data.order ?? null,
      data.courses?.map((c: any) => Course.fromApi(c)) ?? null
    );
  }


  toPayload(): any {
    return {
      id: this.id,
      path_id: this.path?.id,
      name: this.name,
      start_at : this.startAt, 
      end_at : this.endAt,
      duration_months: this.durationMonths,
      description: this.description,
      order: this.order,
      courses: this.courses?.map((course) => course.toPayload()) ?? [],
    }
  }
}
