import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonFooter,
  IonSegment,
  IonSegmentButton,
  IonChip,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, sparklesOutline, chatbubblesOutline, ribbonOutline, bulbOutline, eyeOutline } from 'ionicons/icons';
import { ApiService, Insight } from '../../services/api.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'tend-garden-guide-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonButton,
    IonButtons,
    IonIcon,
    IonInput,
    IonFooter,
    IonSegment,
    IonSegmentButton,
    IonChip,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Garden Guide</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment [value]="viewMode()" (ionChange)="switchView($event)">
          <ion-segment-button value="chat">
            <ion-icon name="chatbubbles-outline"></ion-icon>
            <ion-label>Chat</ion-label>
          </ion-segment-button>
          <ion-segment-button value="insights">
            <ion-icon name="sparkles-outline"></ion-icon>
            <ion-label>Insights</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content #chatContent>
      @if (viewMode() === 'insights') {
        <!-- Insights View -->
        <div class="ion-padding">
          @if (loadingInsights()) {
            <div class="loading-container">
              <ion-spinner name="crescent" color="primary"></ion-spinner>
              <p>Gathering insights...</p>
            </div>
          } @else {
            @if (insightsSummary()) {
              <ion-card class="summary-card">
                <ion-card-content>
                  <p>{{ insightsSummary() }}</p>
                </ion-card-content>
              </ion-card>
            }

            @if (insights().length === 0) {
              <ion-card>
                <ion-card-content class="empty-state">
                  <div class="empty-icon">🌱</div>
                  <p>No specific insights right now. Your garden is doing well!</p>
                </ion-card-content>
              </ion-card>
            } @else {
              @for (insight of insights(); track $index) {
                <ion-card class="insight-card" [class]="'insight-' + insight.type">
                  <ion-card-content>
                    <div class="insight-header">
                      <span class="insight-icon">{{ getInsightIcon(insight.type) }}</span>
                      <div class="insight-title-section">
                        <h3>{{ insight.title }}</h3>
                        @if (insight.lifeArea) {
                          <ion-chip size="small" color="tertiary">{{ insight.lifeArea }}</ion-chip>
                        }
                      </div>
                    </div>
                    <p class="insight-message">{{ insight.message }}</p>
                  </ion-card-content>
                </ion-card>
              }
            }
          }
        </div>
      } @else {
        <!-- Chat View -->
        <div class="chat-container" #chatContainer>
          @if (messages().length === 0) {
            <div class="welcome-section">
              <div class="welcome-icon">🌿</div>
              <h3>Welcome to the Garden Guide</h3>
              <p>I'm here to help you tend your life garden. Ask me about your progress, get suggestions for practices, or just chat about how you're doing.</p>

              <div class="quick-prompts">
                @for (prompt of quickPrompts; track prompt) {
                  <ion-chip (click)="sendMessage(prompt)" color="light">
                    {{ prompt }}
                  </ion-chip>
                }
              </div>
            </div>
          } @else {
            @for (message of messages(); track $index) {
              <div class="message" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'">
                <div class="message-bubble">
                  <p>{{ message.content }}</p>
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                </div>
              </div>
            }

            @if (isTyping()) {
              <div class="message assistant">
                <div class="message-bubble typing">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
            }
          }
        </div>
      }
    </ion-content>

    @if (viewMode() === 'chat') {
      <ion-footer>
        <ion-toolbar>
          <div class="input-container">
            <ion-input
              [(ngModel)]="inputMessage"
              (keyup.enter)="sendMessage()"
              [disabled]="isTyping()"
              placeholder="Ask the Garden Guide..."
              class="chat-input"
            ></ion-input>
            <ion-button
              (click)="sendMessage()"
              [disabled]="!inputMessage.trim() || isTyping()"
              fill="solid"
              color="primary"
            >
              <ion-icon slot="icon-only" name="send-outline"></ion-icon>
            </ion-button>
          </div>
        </ion-toolbar>
      </ion-footer>
    }
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: var(--ion-color-medium);
    }

    .summary-card {
      --background: linear-gradient(135deg, #f8f6f1 0%, #f0ebe1 100%);
    }

    .insight-card {
      margin-bottom: 12px;
      border-left: 4px solid var(--ion-color-primary);
    }

    .insight-card.insight-celebration {
      border-left-color: #3d9a50;
    }

    .insight-card.insight-encouragement {
      border-left-color: #f2b82b;
    }

    .insight-card.insight-suggestion {
      border-left-color: #5fb56f;
    }

    .insight-card.insight-observation {
      border-left-color: #7a9d80;
    }

    .insight-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 8px;
    }

    .insight-icon {
      font-size: 24px;
    }

    .insight-title-section h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .insight-message {
      margin: 0;
      color: var(--ion-color-medium-shade);
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      padding: 16px;
      min-height: 100%;
    }

    .welcome-section {
      text-align: center;
      padding: 40px 20px;
    }

    .welcome-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .welcome-section h3 {
      margin: 0 0 8px 0;
      color: var(--ion-color-dark);
    }

    .welcome-section p {
      color: var(--ion-color-medium);
      margin-bottom: 24px;
    }

    .quick-prompts {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }

    .quick-prompts ion-chip {
      cursor: pointer;
    }

    .message {
      display: flex;
      margin-bottom: 12px;
    }

    .message.user {
      justify-content: flex-end;
    }

    .message.assistant {
      justify-content: flex-start;
    }

    .message-bubble {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 18px;
    }

    .message.user .message-bubble {
      background: linear-gradient(135deg, #3d9a50 0%, #5fb56f 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message.assistant .message-bubble {
      background: var(--ion-color-light);
      color: var(--ion-color-dark);
      border-bottom-left-radius: 4px;
    }

    .message-bubble p {
      margin: 0 0 4px 0;
      white-space: pre-line;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
    }

    .message.user .message-time {
      text-align: right;
      display: block;
    }

    .message-bubble.typing {
      display: flex;
      gap: 4px;
      padding: 16px;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: var(--ion-color-medium);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out;
    }

    .dot:nth-child(1) {
      animation-delay: 0s;
    }

    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes bounce {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-8px);
      }
    }

    .input-container {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      gap: 8px;
    }

    .chat-input {
      flex: 1;
      --background: var(--ion-color-light);
      --padding-start: 16px;
      --padding-end: 16px;
      border-radius: 20px;
    }
  `],
})
export class GardenGuidePage implements OnInit {
  @ViewChild('chatContent') private chatContent!: IonContent;

  private api = inject(ApiService);

  messages = signal<ChatMessage[]>([]);
  insights = signal<Insight[]>([]);
  insightsSummary = signal('');
  viewMode = signal<'chat' | 'insights'>('chat');
  isTyping = signal(false);
  loadingInsights = signal(false);

  inputMessage = '';

  quickPrompts = [
    'How is my garden doing?',
    'What should I focus on?',
    'Show me my progress',
    'I need some encouragement',
  ];

  constructor() {
    addIcons({
      sendOutline,
      sparklesOutline,
      chatbubblesOutline,
      ribbonOutline,
      bulbOutline,
      eyeOutline,
    });
  }

  ngOnInit(): void {
    this.loadInsights();
  }

  switchView(event: CustomEvent): void {
    this.viewMode.set(event.detail.value as 'chat' | 'insights');
    if (event.detail.value === 'insights' && this.insights().length === 0) {
      this.loadInsights();
    }
  }

  private loadInsights(): void {
    this.loadingInsights.set(true);
    this.api.getInsights().subscribe({
      next: (response) => {
        this.insights.set(response.insights);
        this.insightsSummary.set(response.summary);
        this.loadingInsights.set(false);
      },
      error: () => {
        this.loadingInsights.set(false);
      },
    });
  }

  sendMessage(content?: string): void {
    const message = content || this.inputMessage.trim();
    if (!message || this.isTyping()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    this.messages.set([...this.messages(), userMessage]);
    this.inputMessage = '';
    this.isTyping.set(true);

    setTimeout(() => this.scrollToBottom(), 100);

    const history = this.messages()
      .slice(-10)
      .map(m => ({ role: m.role, content: m.content }));

    this.api.chat(message, history).subscribe({
      next: (response) => {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.reply,
          timestamp: new Date(),
        };
        this.messages.set([...this.messages(), assistantMessage]);
        this.isTyping.set(false);
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
          timestamp: new Date(),
        };
        this.messages.set([...this.messages(), errorMessage]);
        this.isTyping.set(false);
      },
    });
  }

  private scrollToBottom(): void {
    if (this.chatContent) {
      this.chatContent.scrollToBottom(300);
    }
  }

  getInsightIcon(type: string): string {
    const icons: Record<string, string> = {
      celebration: '🎉',
      encouragement: '💪',
      suggestion: '💡',
      observation: '👀',
    };
    return icons[type] || '🌱';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
