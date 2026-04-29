import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    // Replace with your actual API endpoint
    return this.http.post('/api/chat', { message });
  }
}
