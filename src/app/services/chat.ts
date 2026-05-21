import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = '/api/chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {
    // Now sends only the message to the backend, which handles OpenAI
    return this.http.post(this.apiUrl, { message });
  }
}