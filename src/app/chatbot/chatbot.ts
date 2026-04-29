import { Component } from '@angular/core';
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
  loading = false;

  constructor(private chatService: ChatService) {}

  sendMessage() {

    const userMessage = this.userInput;

    this.messages.push({
      sender: 'Tú',
      text: userMessage
    });

    this.userInput = '';
    this.loading = true;

    this.chatService.sendMessage(userMessage)
      .subscribe((res: any) => {

        this.messages.push({
          sender: 'Bot',
          text: res.choices[0].message.content
        });

        this.loading = false;

      });
  }
}