import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}

  sendMessage(message: string): Observable<any> {
    const promise = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }).then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.response || 'No se pudo conectar con el backend.');
      }

      return data;
    });

    return from(promise);
  }
}