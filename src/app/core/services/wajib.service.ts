import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { User } from '../models/User.model';

@Injectable({ providedIn: 'root' })
export class WajibService {
  private baseUrl: string = environment.apiUrl;

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async createWajib(wajib: any, student?: User): Promise<any> {
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
        `${this.baseUrl}wajibs`,
        { wajib, student },
        {
          headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        'Error creating wajib:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async updateWajib(wajib: any): Promise<any> {
    const token = this.getToken();
    const headers = token
      ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/json' };
    try {
      const response = await axios.put(
        `${this.baseUrl}wajibs/${wajib.id}`,
        wajib,
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        'Error updating wajib:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async deleteWajib(id: number): Promise<any> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await axios.delete(`${this.baseUrl}wajibs/${id}`, {
        headers,
      });
      return response.data;
    } catch (error: any) {
      console.error(
        'Error deleting wajib:',
        error.response?.data || error.message
      );
      throw error;
    }
  }
}
