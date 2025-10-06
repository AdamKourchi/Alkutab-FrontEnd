import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';

export interface ProfileUpdateData {
  name: string;
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;


  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }


  constructor() {}

  async updateProfile(userType: 'admin' | 'teacher' | 'student', data: ProfileUpdateData): Promise<any> {
    try {
      const token = this.getToken();
      if (!token) throw new Error('Authentication token not found');

      const response = await axios.put(
        `${this.apiUrl}${userType}s/profile`, 
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  async getProfile(userType: 'admin' | 'teacher' | 'student'): Promise<any> {
    const token = this.getToken();
    if (!token) throw new Error('Authentication token not found');
  
    try {
      const response = await axios.get(`${this.apiUrl}${userType}s/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Profile fetch failed:', error.response?.data || error.message);
      throw error;
    }
  }
  
} 