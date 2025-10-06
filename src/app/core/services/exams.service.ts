import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Exam } from '../models/Exam.model';
import { ExamSubmission } from '../models/ExamSubmission.model';

@Injectable({ providedIn: 'root' })
export class ExamsService {
  private baseUrl: string = environment.apiUrl;

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getHeaders(): any {
    const token = this.getToken();
    return {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  public async getAllExams(): Promise<Exam[]> {
    try {
      const response = await axios.get(`${this.baseUrl}exams`, {
        headers: this.getHeaders(),
      });
      return response.data.map((data: any) => Exam.fromApi(data));
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  }

  public async getExamById(id: number): Promise<Exam> {
    try {
      const response = await axios.get(`${this.baseUrl}exams/${id}`, {
        headers: this.getHeaders(),
      });
      return Exam.fromApi(response.data);
    } catch (error) {
      console.error('Error fetching exam:', error);
      throw error;
    }
  }

  public async getExamByCourseId(courseId: number): Promise<Exam[]> {
    try {
      const response = await axios.get(`${this.baseUrl}exams/${courseId}`, {
        headers: this.getHeaders(),
      });      
      return response.data.map((data: any) => Exam.fromApi(data));
    } catch (error) {
      console.error('Error fetching exams by course:', error);
      throw error;
    }
  }

  public async createExam(exam: Exam): Promise<Exam> {
    try {
        console.log("PAYLOAD : " , exam)

      const response = await axios.post(
        `${this.baseUrl}exams`,
        
        exam.toPayload(),
        { headers: this.getHeaders() }
      );
      return Exam.fromApi(response.data);
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  }

  public async updateExam(exam: Exam): Promise<Exam> {
    try {
      const response = await axios.put(
        `${this.baseUrl}exams/${exam.id}`,
        exam.toPayload(),
        { headers: this.getHeaders() }
      );
      return Exam.fromApi(response.data);
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  }

  public async deleteExam(id: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}exams/${id}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  }

  public async getExamsByCourse(courseId: number): Promise<Exam[]> {
    try {
      const response = await axios.get(`${this.baseUrl}courses/${courseId}/exams`, {
        headers: this.getHeaders(),
      });
      return response.data.map((data: any) => Exam.fromApi(data));
    } catch (error) {
      console.error('Error fetching exams by course:', error);
      throw error;
    }
  }


  public async updateExamStatus(examId: number, status: string, date: string): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}exams/${examId}/status`, {
        status,
        date,
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error updating exam status:', error);
      throw error;
    }
  }

  public async getExamResults(examId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}exams/${examId}/results`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exam results:', error);
      throw error;
    }
  }

  public async submitExamAnswers(examId: number, answers: any[]): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}exam-submissions`,
        {
          exam_id: examId,
          answers: answers,
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error submitting exam answers:', error);
      throw error;
    }
  }

  public async getExamSubmissions(examId: number): Promise<ExamSubmission[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}exam-submissions/${examId}`,
        {
          headers: this.getHeaders(),
        }
      );
      console.log(response.data);
      
      return response.data.map((data: any) => ExamSubmission.fromApi(data));
    } catch (error) {
      console.error('Error fetching exam submissions:', error);
      throw error;
    }
  }

  public async updateExamSubmission(
    submissionId: number,
    data: {
      teacher_comment: string | null;
      score: number | null;
      next_level_decision: 'pass' | 'fail' | null;
    }
  ): Promise<any> {
    try {
      const response = await axios.put(
        `${this.baseUrl}exam-submissions/${submissionId}`,
        data,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating exam submission:', error);
      throw error;
    }
  }
}

