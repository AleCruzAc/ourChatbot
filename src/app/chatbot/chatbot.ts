import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';

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
  loading = false;
  errorMessage = '';

  constructor(
    private chatService: ChatService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  async sendMessage() {
    const userMessage = this.userInput.trim();

    if (!userMessage || this.loading) {
      return;
    }

    this.errorMessage = '';

    this.messages.push({
      sender: 'Tu',
      text: userMessage,
    });

    this.userInput = '';
    this.loading = true;

    try {
      const res = await this.chatService.sendMessage(userMessage);
      const botText = res?.choices?.[0]?.message?.content;

      this.messages.push({
        sender: 'Bot',
        text: botText || 'No recibi una respuesta valida del asistente.',
      });
    } catch (error) {
      console.error('Chat request failed:', error);
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo conectar con el asistente. Intenta de nuevo.';
    } finally {
      this.loading = false;
      this.changeDetector.detectChanges();
    }
  }
}
