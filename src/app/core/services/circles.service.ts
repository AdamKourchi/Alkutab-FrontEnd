import { Injectable } from '@angular/core';
import axios from 'axios';
import { Circle } from '../models/Circle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CirclesService {
  private apiUrl = `${environment.apiUrl}circles`;

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }


  async getAllCircles(): Promise<Circle[]> {
        const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(this.apiUrl, { headers });
      return response.data.map((circle: any) => Circle.fromApi(circle));
    } catch (error) {
      console.error('Error fetching circles:', error);
      throw error;
    }
  }


   async getCircleById(id:number): Promise<Circle> {
        const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.apiUrl}/${id}`, { headers });
                        console.log(response.data);

      return  Circle.fromApi(response.data);
    } catch (error) {
      console.error('Error fetching circles:', error);
      throw error;
    }
  }

  async getCirclesByPath(pathId: number): Promise<Circle[]> {
    try {
      const response = await axios.get(`${this.apiUrl}path/${pathId}`);
      return response.data.map((circle: any) => Circle.fromApi(circle));
    } catch (error) {
      console.error('Error fetching circles by path:', error);
      throw error;
    }
  }

  async getCirclesByTeacher(teacherId: number): Promise<Circle[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/teacher/${teacherId}`);
      return response.data.map((circle: any) => Circle.fromApi(circle));
    } catch (error) {
      console.error('Error fetching circles by teacher:', error);
      throw error;
    }
  }

  async createCircle(circle: Circle): Promise<Circle> {
    try {
      const token = this.getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(this.apiUrl, circle.toPayload(), { headers });
      return Circle.fromApi(response.data);
    } catch (error) {
      console.error('Error creating circle:', error);
      throw error;
    }
  }

  async updateCircle(circle: Circle): Promise<Circle> {
    try {
      const response = await axios.put(`${this.apiUrl}/${circle.id}`, circle.toPayload());
      return Circle.fromApi(response.data);
    } catch (error) {
      console.error('Error updating circle:', error);
      throw error;
    }
  }

  async deleteCircle(id: number): Promise<void> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    try {
      await axios.delete(`${this.apiUrl}/${id}`, { headers });
    } catch (error) {
      console.error('Error deleting circle:', error);
      throw error;
    }
  }
} 