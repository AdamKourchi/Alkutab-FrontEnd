import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Enrollment } from '../models/Enrollment.model';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {

  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async getEnrollmentsByCourseId(id: number){
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}enrollmentsByCourses/${id}`, {
        headers,
      });
            
      return response.data.map((data:any) => Enrollment.fromApi(data));
    } catch (error) {
      console.error('Error fetching path by ID:', error);
      throw error;
    }
  }


}
