import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { Course } from '../models/Course.model';

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async getAll(): Promise<Course[]> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}courses`, { headers });

      console.log('Courses:', response.data);
      
      return response.data.map((userData: any) => Course.fromApi(userData));
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  public async createCourse(course: Course): Promise<Course> {
    
    
    const token = this.getToken();

    const headers =  {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }

    try {
      const response = await axios.post(
        `${this.baseUrl}courses`,
        course.toPayload(),
        { headers }
      );
      return Course.fromApi(response.data);
    } catch (error: any) {
      console.error(
        'Error creating course:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async deleteCourse(courseId: number): Promise<void> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      await axios.delete(`${this.baseUrl}courses/${courseId}`, { headers });
    } catch (error: any) {
      console.error(
        'Error deleting course:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async updateCourse(course: Course): Promise<Course> {    
    const token = this.getToken();
    const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
     
    try {
      const response = await axios.put(
        `${this.baseUrl}courses/${course.id}`,
        course.toPayload(),
        { headers }
      );
      return Course.fromApi(response.data);
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }


}