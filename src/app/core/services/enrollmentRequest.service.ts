import axios from 'axios';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { EnrollmentRequest } from '../models/EnrollmentRequest.model';

@Injectable({ providedIn: 'root' })
export class enrollmentRequestService {
  private baseUrl: string = environment.apiUrl; // Replace with your API base URL
  constructor() { }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public async getRequestsByStudentId(studentId: number | null): Promise<EnrollmentRequest[]> {

    console.log('Fetching requests for student ID:', studentId);
    
    if (studentId == null) {
      throw new Error('Student ID is required to fetch requests.');
    }

    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}requests/student/${studentId}`, { headers });
      return response.data.map((data: any) => EnrollmentRequest.fromApi(data));
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  }
 
  public async getAllRequests(): Promise<EnrollmentRequest[]> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(`${this.baseUrl}requests`, { headers });
      return response.data.map((data: any) => EnrollmentRequest.fromApi(data));
      
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  }

  public async createRequest(request: EnrollmentRequest, pathId: number): Promise<EnrollmentRequest> {
    const token = this.getToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}requests`,
        { path_id: pathId, request_enrollment: request.toPayload() },
        { headers }
      );

      return EnrollmentRequest.fromApi(response.data);
    } catch (error: any) {
      console.error(
        'Error creating request:',
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async approveRequest(requestId: number,selectedCircleId : number|null = null): Promise<EnrollmentRequest> {    
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.post(
        `${this.baseUrl}approve-request/${requestId}/${selectedCircleId}`,
        {},
        { headers }
      );
      return EnrollmentRequest.fromApi(response.data);
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  }

  public async rejectRequest(requestId: number, reason: string): Promise<EnrollmentRequest> {
    const token = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.post(
        `${this.baseUrl}reject-request/${requestId}`,
        { reason },
        { headers }
      );
      return EnrollmentRequest.fromApi(response.data);
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  }
}
