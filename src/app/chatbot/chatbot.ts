import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class ChatbotComponent {
  messages: any[] = [];
  userInput = '';
  isLoading = false;
  isSidebarOpen: boolean = true;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
  ) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput;

    this.messages.push({
      sender: 'Tú',
      text: userMessage,
      isBot: false
    });

    this.userInput = '';
    this.isLoading = true;

    this.chatService.sendMessage(userMessage).subscribe({
      next: (res: any) => {
        this.messages.push({ text: res.response, isBot: true });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.messages.push({ text: 'Lo siento, tuve un error de conexión.', isBot: true });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  createNewChat() {
    this.messages = [];
    this.userInput = '';

    this.messages.push({
      text: '¡Hola! He iniciado un nuevo canal para ti. ¿Qué inquietud tienes hoy sobre el futuro de tu profesión y la Inteligencia Artificial?',
      isBot: true
    });
  }
}
