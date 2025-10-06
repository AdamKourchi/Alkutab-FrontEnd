import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Path } from '../models/Path.model';

@Injectable({ providedIn: 'root' })
export class StudentPathService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async getAllPaths(): Promise<Path[]> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}student-paths`, { headers });
      return response.data.map((pathData: any) => Path.fromApi(pathData));
    } catch (error) {
      console.error('Error fetching paths:', error);
      throw error;
    }
  }

  public async enrollInPath(pathId: number, enrollmentData: any): Promise<any> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.post(`${this.baseUrl}enrollments`, {
        path_id: pathId,
        education_level: enrollmentData.educationLevel,
        goal: enrollmentData.goal,
        notes: enrollmentData.notes,
        memorization_capability: enrollmentData.memorizationCapability
      }, { headers });
      return response.data;
    } catch (error) {
      console.error('Error enrolling in path:', error);
      throw error;
    }
  }
}
