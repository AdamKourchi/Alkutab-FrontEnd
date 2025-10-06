import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

import { Post } from '../models/Post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL

  constructor() {}

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  async getPostsByCourseId(courseId: number): Promise<Post[]> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    try {
      const response = await axios.get(
        `${this.baseUrl}teacher-posts/${courseId}`,
        {
          headers: headers,
        }
      );

      console.log('Posts:', response.data);

      return response.data.map(Post.fromApi);
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  public async addRessource(
    content: string,
    courseId: number,
    files: File[]
  ): Promise<any> {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('course_id', courseId.toString());

    files.forEach((file) => {
      formData.append('files[]', file);
    });

    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.post(
        `${this.baseUrl}teacher-posts/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Failed to add teaching resource:', error);
      throw error;
    }
  }

  async downloadFile(path: string): Promise<void> {
    console.log({path});
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${this.baseUrl}secure-files`,{path},
        
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = Math.random().toString(36).substring(2, 15);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  public async deletePost(id: number): Promise<any> {
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.delete(
        `${this.baseUrl}teacher-posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error('Failed to delete teaching resource:', error);
      throw error;
    }
  }
}
