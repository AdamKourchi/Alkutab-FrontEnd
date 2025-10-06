import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private axiosInstance: AxiosInstance;
  currentUser: any = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
    });

    // Restore token and role from localStorage if available
    const storedToken = localStorage.getItem('authToken');
    const storedRole = localStorage.getItem('authRole');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken) {
      this.setToken(storedToken);
    }
    if (storedRole) {
      this.setRole(storedRole);
    }
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  private setToken(token: string | null) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  private setRole(role: string | null) {
    if (role) {
      localStorage.setItem('authRole', role);
    } else {
      localStorage.removeItem('authRole');
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return from(this.axiosInstance.post('/login', credentials)).pipe(
      tap((response: any) => {
        const token = response.data.token;
        const role = response.data.user.role;

        this.setToken(token);
        this.setRole(role);
      })
    );
  }

  getRole() {
    return localStorage.getItem('authRole');
  }

  getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async fetchUser(): Promise<any> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}me`, { headers });
      localStorage.setItem('authUser', JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  }

  public async getStudentsByCourseId(courseId: number | null) {
    if (courseId) {
      const token = this.getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const response = await axios.get(
          `${this.baseUrl}students-by-course/${courseId}`,
          {
            headers,
          }
        );

        return response.data;
      } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
      }
    }
  }

  async logout() {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      await axios.post(`${this.baseUrl}logout`, {}, { headers });
      localStorage.removeItem('authUser');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    // Clear token and role from localStorage
    this.setToken(null);
    this.setRole(null);
  }

  register(user: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return from(this.axiosInstance.post('/register', user)).pipe(
      tap((response: any) => {
        const token = response.data.token;
        const role = response.data.user.role;

        this.setToken(token);
        this.setRole(role);
      })
    );
  }
}
