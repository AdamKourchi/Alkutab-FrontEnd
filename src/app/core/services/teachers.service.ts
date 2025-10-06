import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';

@Injectable({ providedIn: 'root' })
export class TeachersService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async getAll(): Promise<User[]> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}teachers`, { headers });
      return response.data.map((userData: any) => User.fromApi(userData));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  }

  public async createTeacher(teacher: User): Promise<User> {
    const token = this.getToken();

    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        };

    try {
      const response = await axios.post(
        `${this.baseUrl}teachers`,
        teacher.toPayload(),
        { headers }
      );
      return User.fromApi(response.data);
    } catch (error: any) {
      console.error(
        'Error creating path:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async inviteTeacher(teacher: User): Promise<User> {
    const token = this.getToken();

    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        };
    try {
      const response = await axios.post(
        `${this.baseUrl}invite-teacher`,
        teacher.toPayload(),
        { headers }
      );
      return User.fromApi(response.data);
    } catch (error: any) {
      console.error(
        'Error inviting teacher:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async deleteTeacher(teacherId: number): Promise<void> {
    const token = this.getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      await axios.delete(`${this.baseUrl}teachers/${teacherId}`, { headers });
    } catch (error: any) {
      console.error(
        'Error deleting teacher:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  
}
