import { Level } from './Level.model';
import { Enrollment } from './Enrollment.model';
import { Circle } from './Circle.model';

export class Path {
  constructor(
    public id: number | null,
    public name: string | null,
    public description: string | null,
    public createdBy: number | null,
    public diplomaTitle: string | null,
    public isActive: boolean | null,
    public isHifd: boolean | null = false,
    public enrollments: Enrollment[] | null = null,
    public levels: Level[] | null = null,
    public circles: Circle[] | null = null
  ) {}

  static fromApi(data: any): Path {
    return new Path(
      data.id ?? null,
      data.name ?? null,
      data.description ?? null,
      data.created_by ?? null,
      data.diploma_title ?? null,
      data.is_active === 1, 
      data.is_hifd === 1, 
      data.enrollment?.map((student: any) => Enrollment.fromApi(student)) ?? null,
      data.levels?.map((level: any) => Level.fromApi(level)) ?? null,
      data.circles?.map((circle: any) => Circle.fromApi(circle)) ?? null

    );
  }

  toPayload(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      diploma_title: this.diplomaTitle,
      is_active: this.isActive ? 1 : 0,
      is_hifd: this.isHifd ? 1 : 0,
      levels: Array.isArray(this.levels) ? this.levels.map((level) => level.toPayload()) : [],
      enrollments: this.enrollments?.map((student) => student.id) ?? [], 
      circles: Array.isArray(this.circles) ? this.circles.map((circle) => circle.toPayload()) : []
    };
  }
}
