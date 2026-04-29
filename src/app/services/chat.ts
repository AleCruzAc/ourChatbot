import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  private apiKey = 'YOUR_OPENAI_API_KEY';

  constructor(private http: HttpClient) {}

  sendMessage(message: string) {

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Eres un asistente amigable y claro.' },
        { role: 'user', content: message }
      ]
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}