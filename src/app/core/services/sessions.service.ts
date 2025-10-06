import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { ClassSession } from '../models/ClassSession.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Manual save function for the save button
  // async saveCalendarEvents(calendarApi: any) {
  //   if (!calendarApi) {
  //     console.error('Could not get calendar API');
  //     return;
  //   }

  //   const events = calendarApi.getEvents();
  //   const sessionEvents = events.filter(
  //     (event: { extendedProps: { isPath?: boolean } }) =>
  //       !event.extendedProps?.isPath
  //   );

  //   let sessionsToSave: any[] = [];

  //   for (const event of sessionEvents) {

  //     const baseSession = {
  //       course_id: event.extendedProps?.courseId || null,
  //       title: event.title,
  //       description: event.extendedProps?.description || null,
  //       link: null,
  //       status: 'scheduled',
  //     };

      

  //     // Handle single (non-recurring) events
  //     sessionsToSave.push({
  //       ...baseSession,
  //       start_time: this.formatDateToISO(event.start),
  //       end_time: this.formatDateToISO(event.end),
  //     });
  //   }

  //   try {
  //     const token = this.getToken();
  //     if (!token) {
  //       throw new Error('Authentication token not found');
  //     }

  //     const response = await axios.post(
  //       `${this.baseUrl}schedule`,
  //       { sessions: sessionsToSave },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     return response.data;
  //   } catch (error) {
  //     console.error('Error saving calendar events:', error);
  //     throw error;
  //   }
  // }
  async saveCalendarEvents(calendarApi: any) {
    if (!calendarApi) {
      console.error('Could not get calendar API');
      return;
    }
  
    const events = calendarApi.getEvents();
    const sessionEvents = events.filter(
      (event: any) => !event.extendedProps?.isPath
    );

    
  
    const sessionsToSave: any[] = [];
  
    for (const event of sessionEvents) {
      if (!event.start || !event.end) {
        console.warn('Skipping event due to missing start or end:', event);
        continue;
      }

      sessionsToSave.push({
        course_id: event.extendedProps?.courseId || null,
        title: event.title,
        description: event.extendedProps?.description || null,
        link: null,
        status: 'scheduled',
        start_time: this.formatDateToISO(event.start),
        end_time: this.formatDateToISO(event.end),
        type: event.extendedProps?.type || null,
        exam_id: event.extendedProps?.examId || null,
      });
    }
  
    try {
      const token = this.getToken();
      if (!token) throw new Error('Authentication token not found');
  
      const response = await axios.post(
        `${this.baseUrl}schedule`,
        { sessions: sessionsToSave },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      return response.data;
    } catch (error) {
      console.error('Error saving calendar events:', error);
      throw error;
    }
  }
  


  // Helper method to format dates consistently
  private formatDateToISO(date: Date): string {
    return date
      .toLocaleString('sv-SE', { timeZone: 'Africa/Casablanca' })
      .replace(' ', 'T');
  }

  async getSessions() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${this.baseUrl}schedule`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Fetched sessions:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  }

  async getSessionById(id: number) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${this.baseUrl}sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching session by ID:', error);
      throw error;
    }
  }

  async getSessionByTeacherId(id: number) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${this.baseUrl}schedule/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching session by teacher ID:', error);
      throw error;
    }
  }

  async getSessionByStudentId(id: number) {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(
        `${this.baseUrl}schedule-student/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching session by teacher ID:', error);
      throw error;
    }
  }

  async updateSession(event: any) {}

  async deleteSession(id: any) {}

  async createSession(event: any) {}
}
