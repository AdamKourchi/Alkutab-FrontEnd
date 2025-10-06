import { User } from './User.model'; // Assuming User model exists
import { Path } from './Path.model'; // Assuming Path model exists
import { Level } from './Level.model';
import { Circle } from './Circle.model';

export class Enrollment {
  constructor(
    public id: number | null,
    public user: User | null, // Changed from userId to User object
    public path: Path | null, // Changed from pathId to Path object
    public circle: Circle | null, // Optional Circle object
    public enrolledAt: string | Date | null,
    public level: Level | null,
    public status: string = 'in_progress', // Default: in_progress
    public finalScore: number | null = null,
    public graduated: boolean = false, // Default: false
  ) {}

  static fromApi(data: any): Enrollment {
    return new Enrollment(
      data.id ?? null,
      data.student ? User.fromApi(data.student) : null, // Convert user data to User object
      data.path ? Path.fromApi(data.path) : null, // Convert path data to Path object
      data.circle ? Circle.fromApi(data.circle) : null, // Convert circle data to Circle object
      data.enrolled_at ?? null,
      data.level ? Level.fromApi(data.level) : null,
        data.status ?? 'in_progress',
      data.final_score ?? null,
      data.graduated ?? false,
    );
  }

  toPayload(): any {
    return {
      id: this.id,
      user: this.user ? this.user.toPayload() : null, // Convert User object to payload
      path: this.path ? this.path.toPayload() : null, // Convert Path object to payload
      circle: this.circle ? this.circle.toPayload() : null, // Convert Circle object to payload
      enrolled_at: this.enrolledAt,
      level: this.level ? this.level.toPayload() : null,
      status: this.status,
      final_score: this.finalScore,
      graduated: this.graduated,
    };
  }
}