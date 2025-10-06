import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { Course } from '../models/Course.model';

@Injectable({ providedIn: 'root' })
export class CoursesTeacherService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async fetchCourse(id : number){
    const token = this.getToken();
    const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
     
    try {
      const response = await axios.get(
        `${this.baseUrl}teacher-courses/${id}`,
        { headers }
      );
      
      return Course.fromApi(response.data);
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }

  }


  public async getAllCourses(teacherId: number){
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    try {
      const response = await axios.get(`${this.baseUrl}teacher-courses-all/${teacherId}`, { headers });
      return response.data.map((courseData: any) => Course.fromApi(courseData));
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  } 


   

}