export class File {
    constructor(
      public id: number | null,
      public filePath: string | null,
      public type :  ['book', 'video', 'image'],
      public createdAt: string | null,
    ) {}
  
    static fromApi(data: any): File {
      return new File(
        data.id ?? null,
        data.file_path ?? null,
        data.type ?? null,
        data.created_at ?? null,
      );
    }
  
    toPayload(): any {
      return {
        id: this.id,
        file_path: this.filePath,
      };
    }
  }
  