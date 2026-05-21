import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
})
export class ChatbotComponent {
  messages: any[] = [];
  userInput = '';
  isLoading = false;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
  ) {}

  sendMessage() {
    const userMessage = this.userInput;

    this.messages.push({
      sender: 'Tú',
      text: userMessage,
    });

    this.userInput = '';
    this.isLoading = true;

    this.chatService.sendMessage(userMessage).subscribe({
      next: (res) => {
        this.messages.push({ text: res.response, isBot: true });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.messages.push({ text: 'Lo siento, tuve un error de conexión.', isBot: true });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
