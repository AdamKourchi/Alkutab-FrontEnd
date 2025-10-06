export class ClassSession {
  course: any;

  constructor(
    public id: number | null,
    public courseId: number | null,
    public title: string | null,
    public description: string | null,
    public link: string | null,
    public startTime: string | null,
    public endTime: string | null,
    public status: 'scheduled' | 'live' | 'ended' | null
  ) {}

  static fromApi(data: any): ClassSession {
    return new ClassSession(
      data.id ?? null,
      data.course_id ?? null,
      data.title ?? null,
      data.description ?? null,
      data.link ?? null,
      data.start_time ?? null,
      data.end_time ?? null,
      data.status ?? 'scheduled'
    );
  }

  toPayload(): any {
    return {
      course_id: this.courseId,
      title: this.title,
      description: this.description,
      link: this.link,
      start_time: this.startTime,
      end_time: this.endTime,
      status: this.status
    };
  }
}
