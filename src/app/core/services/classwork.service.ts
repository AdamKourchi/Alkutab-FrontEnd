import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Question } from '../models/Question.model';

@Injectable({ providedIn: 'root' })
export class ClassworkService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async getAllByCourseId(courseId: number): Promise<Question[]> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}questions/${courseId}`, {
        headers,
      });

      return response.data.map((question: any) => Question.fromApi(question));
    } catch (error) {
      console.error('Error fetching paths:', error);
      throw error;
    }
  }

  public async createQuestion(question: Question) {
    const token = this.getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}questions`,
        question.toPayload(),
        { headers }
      );
      return Question.fromApi(response.data);
    } catch (error: any) {
      console.error(
        'Error creating path:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async deleteQuestion(id: number) {
    const token = this.getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    try {
      const response = await axios.delete(`${this.baseUrl}questions/${id}`, {
        headers,
      });
      return response;
    } catch (error: any) {
      console.error(
        'Error creating path:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async studentSubmit(data: any) {
    const token = this.getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(`${this.baseUrl}student-submit`, data, {
        headers,
      });
      return Question.fromApi(response.data);
    } catch (error: any) {
      console.error(
        'Error creating path:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async updateAnswerCorrection(
    answerId: number,
    teacher_comment: string
  ) {
    const token = this.getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.put(
        `${this.baseUrl}answers/${answerId}/correction`,
        {teacher_comment},
        { headers }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        'Error updating answer correction:',
        error.response?.data || error.message
      );
      throw error;
    }
  }
}
