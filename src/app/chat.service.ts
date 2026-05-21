import { Injectable } from '@angular/core';
import OpenAI from 'openai';
import { from, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private openai = new OpenAI({
    apiKey: environment.openaiApiKey, // Empieza con gsk-
    baseURL: 'https://api.groq.com/openai/v1', // <-- Esta línea desvía el tráfico a Groq
    dangerouslyAllowBrowser: true,
  });

  constructor() {}

  sendMessage(message: string): Observable<any> {
    const promise = this.openai.chat.completions
      .create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'Eres un asistente virtual de orientación profesional para estudiantes próximos a egresar de la Universidad Ean. Tu objetivo es mitigar la ansiedad tecnológica (AI Anxiety) explicándoles cómo la Inteligencia Artificial no los va a reemplazar, sino que es una herramienta para potenciar sus carreras en Ingeniería, Administración o Humanidades. Sé empático, académico, motivador y muy claro.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
      })
      .then((response) => {
        return { response: response.choices[0].message.content };
      });

    return from(promise);
  }
}
