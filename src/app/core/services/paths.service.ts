import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Path } from '../models/Path.model';

@Injectable({ providedIn: 'root' })
export class PathsService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async getAllPaths(): Promise<Path[]> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}paths`, { headers });
      return response.data.map((pathData: any) => Path.fromApi(pathData));
    } catch (error) {
      console.error('Error fetching paths:', error);
      throw error;
    }

    
  }

  public async createPath(path: Path): Promise<Path> {
    const token = this.getToken();

    const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', }
    

    try {      

      const response = await axios.post(
        `${this.baseUrl}paths`,
        path.toPayload(),
        { headers }
      );
      
      return Path.fromApi(response.data);
    } catch (error: any) {
      console.error(
        'Error creating path:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async getPathById(id: number): Promise<Path> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}paths/${id}`, {
        headers,
      });
      return Path.fromApi(response.data);
    } catch (error) {
      console.error('Error fetching path by ID:', error);
      throw error;
    }
  }

  public async updatePath(path: Path): Promise<Path> {
    console.log(path);
    
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

     
      const response = await axios.put(
        `${this.baseUrl}paths/${path.id}`,
        path.toPayload(),
        { headers }
      );
      return Path.fromApi(response.data);
    } catch (error) {
      console.error('Error updating path:', error);
      throw error;
    }
  }

  public async deletePath(id: number): Promise<void> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await axios.delete(`${this.baseUrl}paths/${id}`, { headers });
    } catch (error) {
      console.error('Error deleting path:', error);
      throw error;
    }
  }

  public async getAllPathsOfTeacher(teacherId: number): Promise<Path[]> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}teacher-paths/${teacherId}`, { headers });
      return response.data.map((pathData: any) => Path.fromApi(pathData));
    } catch (error) {
      console.error('Error fetching paths:', error);
      throw error;
    }
  }

  public async getStudentCurentPath(studentId: number): Promise<Path> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}student-current-path/${studentId}`, { headers });
      return Path.fromApi(response.data);
    } catch (error) {
      console.error('Error fetching student current path:', error);
      throw error;
    }
  }
}
