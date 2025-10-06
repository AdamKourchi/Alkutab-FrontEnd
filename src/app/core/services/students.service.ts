import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Path } from '../models/Path.model';
import { User } from '../models/User.model';
import { Enrollment } from '../models/Enrollment.model';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async getAllEnrollments() {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}all-enrollments`, { headers });
      console.log('Fetched enrollments:', response.data);
      
      return response.data.map((enrollmentData: any) => Enrollment.fromApi(enrollmentData));
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  }


  public async getStudentsByCircleId(circleId: number): Promise<User[]> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}students-by-circle/${circleId}`, { headers });  
      return response.data.map((studentData: any) => User.fromApi(studentData));
    } catch (error) {
      throw error;
    }
  }


}
