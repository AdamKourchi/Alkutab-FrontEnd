import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface JitsiTokenResponse {
  token: string;
  domain: string;
  room_name: string;
  user: {
    name: string;
    email: string;
    is_moderator: boolean;
  };
}

@Injectable({
  providedIn: 'root',
})
export class JitsiService {
  private baseUrl: string = environment.apiUrl;

  private apiUrl = `${this.baseUrl}`;

  constructor(private http: HttpClient) {}

  getJitsiToken(
    roomName: string,
    role: string
  ): Observable<JitsiTokenResponse> {
    return this.http.post<JitsiTokenResponse>(`${this.apiUrl}/jitsi/token`, {
      room_name: roomName,
      role: role,
    });
  }
}
