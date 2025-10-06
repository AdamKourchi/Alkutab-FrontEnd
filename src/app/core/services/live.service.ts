import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { ClassSession } from '../models/ClassSession.model';

@Injectable({ providedIn: 'root' })
export class LiveService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async startLiveSession() {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios
        .post(`${this.baseUrl}start-stream`, {}, { headers })
        .then((response) => {
          console.log('Live session started:', response.data);
        });
    } catch (error: any) {
      console.error(
        'Error starting live session:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async joinLiveSession() {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios
        .get(`${this.baseUrl}join-stream`, { headers })
        .then((response) => {
          console.log('Live session joined:', response.data);
        });
    } catch (error: any) {
      console.error(
        'Error joining live session:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async startLive(nextSessionId: number) {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}start-live/${nextSessionId}`,
        {},
        { headers }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Error starting live session:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async endLive(nextSessionId: number) {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}end-live/${nextSessionId}`,
        {},
        { headers }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Error ending live session:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /////////// Circle /////////////

  public async startLiveCircle(circleId: any) {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}start-liveCircle/${circleId}`,
        {},
        { headers }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Error starting live circle:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async endLiveCircle(circleId: any) {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}end-liveCircle/${circleId}`,
        {},
        { headers }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Error ending live session:',
        error.response?.data || error.message
      );
      throw error;
    }
  }
}
