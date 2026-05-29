import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
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
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  messages: any[] = [];
  userInput = '';
  isLoading = false;
  isSidebarOpen: boolean = true;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  scrollToBottom(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        try {
          if (this.myScrollContainer && this.myScrollContainer.nativeElement) {
            this.myScrollContainer.nativeElement.scrollTo({
              top: this.myScrollContainer.nativeElement.scrollHeight,
              behavior: 'smooth'
            });
          }
        } catch (err) {
          console.error('Error en scroll:', err);
        }
      }, 100);
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput;

    this.messages.push({
      sender: 'Tú',
      text: userMessage,
      isBot: false,
    });

    this.userInput = '';
    this.isLoading = true;
    this.scrollToBottom();

    this.chatService.sendMessage(userMessage).subscribe({
      next: (res: any) => {
        this.messages.push({ text: res.response, isBot: true });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.messages.push({ text: 'Lo siento, tuve un error de conexión.', isBot: true });
        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
    });
  }

  createNewChat() {
    this.messages = [];
    this.userInput = '';

    this.messages.push({
      text: '¡Hola! He iniciado un nuevo canal para ti. ¿Qué inquietud tienes hoy sobre el futuro de tu profesión y la Inteligencia Artificial?',
      isBot: true,
    });
  }
}
