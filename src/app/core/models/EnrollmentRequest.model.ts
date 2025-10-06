import { User } from './User.model';
import { Path } from './Path.model';

export class EnrollmentRequest {
    constructor(
        public id: number | null,
        public user: User | null,
        public path: Path | null,
        public educationLevel: 'primary' | 'secondary'
            | 'high'
            | 'university'
            | 'other' | null, /*  primary secondary high university other */

        public goal: string | null,
        public age: number | null,
        public memorizationCapability: string | null,
        public type: 'normal' | 'hifd' | null,
        public status: 'waiting' | 'approved' | 'rejected' | null,
        public createdAt: string | Date | null,
        public memorizeQuran: boolean | null = null, 
    ) { }

    static fromApi(data: any): EnrollmentRequest {
        return new EnrollmentRequest(

            data.id ?? null,
            data.user ? User.fromApi(data.user) : null, // Convert user data to User object
            data.path ? Path.fromApi(data.path) : null, // Convert path data to Path object
            data.education_level ?? null,
            data.goal ?? null,
            data.age ?? null,
            data.memorization_capability ?? null,
            data.type ?? null,
            data.status ?? null,
            data.created_at ?? null,
            data.memorize_quran ?? null, // Convert memorize_quran to boolean

        );
    }

    toPayload(): any {
        return {
            id: this.id,
            user: this.user ? this.user.toPayload() : null, // Convert User object to payload
            path: this.path ? this.path.toPayload() : null, // Convert Path object to payload
            education_level: this.educationLevel,
            goal: this.goal,
            age: this.age,
            memorization_capability: this.memorizationCapability,
            type: this.type,
            status: this.status,
            memorize_quran : this.memorizeQuran, 
        };
    }
}