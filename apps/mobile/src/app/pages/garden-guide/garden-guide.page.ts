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
  IonCardSubtitle,
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
  IonAvatar,
  IonBadge,
  IonFab,
  IonFabButton,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  sendOutline,
  send,
  sparklesOutline,
  sparkles,
  chatbubblesOutline,
  chatbubbles,
  ribbonOutline,
  bulbOutline,
  eyeOutline,
  leafOutline,
  refreshOutline,
  happyOutline,
  rocketOutline,
  trendingUpOutline,
  heartOutline,
} from 'ionicons/icons';
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
    IonCardSubtitle,
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
    IonAvatar,
    IonBadge,
    IonFab,
    IonFabButton,
    IonMenuButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button style="--color: white;"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <ion-icon name="sparkles-outline" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
          Garden Guide
        </ion-title>
        <ion-buttons slot="end">
          @if (viewMode() === 'insights') {
            <ion-button (click)="loadInsights()">
              <ion-icon slot="icon-only" name="refresh-outline"></ion-icon>
            </ion-button>
          }
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar style="--background: rgba(255, 255, 255, 0.95); --border-color: rgba(134, 239, 172, 0.2);">
        <ion-segment [value]="viewMode()" (ionChange)="switchView($event)" style="--background: rgba(240, 253, 244, 0.8); padding: 4px; border-radius: 16px; margin: 8px 16px;">
          <ion-segment-button value="chat" style="--background-checked: white; --indicator-color: white; --color: #6b7280; --color-checked: #22c55e; --border-radius: 12px; font-weight: 500; min-height: 36px;">
            <ion-icon name="chatbubbles-outline" style="font-size: 16px; margin-right: 4px;"></ion-icon>
            <ion-label>Chat</ion-label>
          </ion-segment-button>
          <ion-segment-button value="insights" style="--background-checked: white; --indicator-color: white; --color: #6b7280; --color-checked: #22c55e; --border-radius: 12px; font-weight: 500; min-height: 36px;">
            <ion-icon name="sparkles-outline" style="font-size: 16px; margin-right: 4px;"></ion-icon>
            <ion-label>Insights</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content #chatContent>
      @if (viewMode() === 'insights') {
        <!-- Insights View - Zen Style -->
        <div style="padding: 16px;">
          @if (loadingInsights()) {
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px;">
              <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2); animation: pulse 2s infinite;">
                <span style="font-size: 40px;">✨</span>
              </div>
              <p style="color: #22c55e; font-size: 16px; font-weight: 500;">Gathering insights from your garden...</p>
            </div>
          } @else {
            <!-- Summary Card - Zen Style -->
            @if (insightsSummary()) {
              <ion-card style="--background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%); border-radius: 24px; margin: 0 0 20px 0; border: 1px solid rgba(134, 239, 172, 0.3); box-shadow: 0 8px 32px rgba(34, 197, 94, 0.15);">
                <ion-card-content style="padding: 20px;">
                  <div style="display: flex; align-items: flex-start; gap: 16px;">
                    <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
                      <span style="font-size: 26px;">🌿</span>
                    </div>
                    <div>
                      <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 700; color: #166534;">Garden Overview</h3>
                      <p style="margin: 0; color: #22c55e; line-height: 1.6; font-size: 14px;">{{ insightsSummary() }}</p>
                    </div>
                  </div>
                </ion-card-content>
              </ion-card>
            }

            @if (insights().length === 0) {
              <ion-card style="--background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1);">
                <ion-card-content style="text-align: center; padding: 48px 24px;">
                  <div style="width: 96px; height: 96px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2);">
                    <span style="font-size: 48px;">🌿</span>
                  </div>
                  <h3 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #1f2937;">All is Well!</h3>
                  <p style="margin: 0; color: #6b7280; line-height: 1.6; font-size: 14px;">
                    No specific insights right now.<br>Your garden is thriving beautifully!
                  </p>
                </ion-card-content>
              </ion-card>
            } @else {
              <div style="display: flex; flex-direction: column; gap: 12px;">
                @for (insight of insights(); track $index) {
                  <ion-card [style.background]="getInsightBackground(insight.type)" style="border-radius: 16px; margin: 0; border-left: 4px solid; overflow: hidden;" [style.border-left-color]="getInsightColor(insight.type)">
                    <ion-card-content style="padding: 16px;">
                      <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div [style.background]="getInsightGradient(insight.type)" style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                          <span style="font-size: 22px;">{{ getInsightIcon(insight.type) }}</span>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
                            <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: var(--ion-color-dark);">{{ insight.title }}</h3>
                            @if (insight.lifeArea) {
                              <ion-chip size="small" [style.--background]="getInsightChipColor(insight.type)" style="margin: 0; height: 22px; font-size: 11px;">
                                {{ insight.lifeArea }}
                              </ion-chip>
                            }
                          </div>
                          <p style="margin: 0; color: var(--ion-color-medium-shade); font-size: 14px; line-height: 1.5;">{{ insight.message }}</p>
                        </div>
                      </div>
                    </ion-card-content>
                  </ion-card>
                }
              </div>
            }
          }
        </div>
      } @else {
        <!-- Chat View - Zen Style -->
        <div style="display: flex; flex-direction: column; min-height: 100%; padding: 16px;">
          @if (messages().length === 0) {
            <!-- Welcome State - Zen Style -->
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 24px;">
              <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; position: relative; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2);">
                <span style="font-size: 60px;">🌿</span>
                <div style="position: absolute; bottom: 0; right: 0; width: 40px; height: 40px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
                  <span style="font-size: 18px;">✨</span>
                </div>
              </div>
              <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1f2937;">Welcome, Gardener!</h2>
              <p style="margin: 0 0 32px 0; color: #6b7280; line-height: 1.6; max-width: 280px; font-size: 14px;">
                I'm your personal Garden Guide. Ask me about your progress, get suggestions for practices, or just chat about how you're doing.
              </p>

              <div style="width: 100%; max-width: 320px;">
                <p style="font-size: 11px; font-weight: 600; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">Quick Prompts</p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                  @for (prompt of quickPrompts; track prompt.text) {
                    <ion-button
                      (click)="sendMessage(prompt.text)"
                      fill="outline"
                      expand="block"
                      style="--border-radius: 16px; --border-width: 1px; --border-color: rgba(134, 239, 172, 0.4); --color: #22c55e; --background-hover: rgba(34, 197, 94, 0.08); text-transform: none; font-weight: 500; --padding-top: 14px; --padding-bottom: 14px;"
                    >
                      <ion-icon [name]="prompt.icon" slot="start" style="margin-right: 8px;"></ion-icon>
                      {{ prompt.text }}
                    </ion-button>
                  }
                </div>
              </div>
            </div>
          } @else {
            <!-- Messages - Zen Style -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 16px;">
              @for (message of messages(); track $index) {
                <div [style.justify-content]="message.role === 'user' ? 'flex-end' : 'flex-start'" style="display: flex;">
                  @if (message.role === 'assistant') {
                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 8px; align-self: flex-end; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);">
                      <span style="font-size: 18px;">🌿</span>
                    </div>
                  }
                  <div
                    [style.background]="message.role === 'user' ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(255, 255, 255, 0.9)'"
                    [style.color]="message.role === 'user' ? 'white' : '#1f2937'"
                    [style.border-bottom-right-radius]="message.role === 'user' ? '4px' : '20px'"
                    [style.border-bottom-left-radius]="message.role === 'user' ? '20px' : '4px'"
                    [style.box-shadow]="message.role === 'assistant' ? '0 4px 16px rgba(34, 197, 94, 0.1)' : '0 4px 12px rgba(34, 197, 94, 0.2)'"
                    [style.border]="message.role === 'assistant' ? '1px solid rgba(134, 239, 172, 0.2)' : 'none'"
                    style="max-width: 80%; padding: 14px 18px; border-radius: 20px; backdrop-filter: blur(8px);"
                  >
                    <p style="margin: 0 0 6px 0; white-space: pre-line; line-height: 1.5; font-size: 15px;">{{ message.content }}</p>
                    <span [style.opacity]="0.6" style="font-size: 11px; display: block;" [style.text-align]="message.role === 'user' ? 'right' : 'left'">
                      {{ formatTime(message.timestamp) }}
                    </span>
                  </div>
                </div>
              }

              @if (isTyping()) {
                <div style="display: flex; justify-content: flex-start;">
                  <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 8px; align-self: flex-end; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);">
                    <span style="font-size: 18px;">🌿</span>
                  </div>
                  <div style="background: rgba(255, 255, 255, 0.9); padding: 18px 22px; border-radius: 20px; border-bottom-left-radius: 4px; box-shadow: 0 4px 16px rgba(34, 197, 94, 0.1); border: 1px solid rgba(134, 239, 172, 0.2); display: flex; gap: 6px; backdrop-filter: blur(8px);">
                    <span style="width: 10px; height: 10px; background: #22c55e; border-radius: 50%; animation: typingBounce 1.4s ease-in-out infinite; animation-delay: 0s;"></span>
                    <span style="width: 10px; height: 10px; background: #4ade80; border-radius: 50%; animation: typingBounce 1.4s ease-in-out infinite; animation-delay: 0.2s;"></span>
                    <span style="width: 10px; height: 10px; background: #86efac; border-radius: 50%; animation: typingBounce 1.4s ease-in-out infinite; animation-delay: 0.4s;"></span>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </ion-content>

    @if (viewMode() === 'chat') {
      <ion-footer style="background: transparent;">
        <div style="background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 244, 0.98) 100%); backdrop-filter: blur(16px); border-top: 1px solid rgba(134, 239, 172, 0.2); padding: 12px 16px; padding-bottom: calc(12px + env(safe-area-inset-bottom, 0));">
          <div style="display: flex; align-items: center; gap: 12px; background: rgba(240, 253, 244, 0.8); border: 1px solid rgba(134, 239, 172, 0.3); border-radius: 28px; padding: 6px 6px 6px 20px;">
            <ion-input
              [(ngModel)]="inputMessage"
              (keyup.enter)="sendMessage()"
              [disabled]="isTyping()"
              placeholder="Ask the Garden Guide..."
              style="flex: 1; --padding-start: 0; --padding-end: 0; font-size: 16px; --placeholder-color: #9ca3af;"
            ></ion-input>
            <ion-button
              (click)="sendMessage()"
              [disabled]="!inputMessage.trim() || isTyping()"
              shape="round"
              style="--padding-start: 14px; --padding-end: 14px; height: 44px; width: 44px; margin: 0; --background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); --box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);"
            >
              <ion-icon slot="icon-only" name="send" style="font-size: 20px;"></ion-icon>
            </ion-button>
          </div>
        </div>
      </ion-footer>
    }

    <style>
      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-8px); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
      }
    </style>
  `,
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
    { text: 'How is my garden doing?', icon: 'leaf-outline' },
    { text: 'What should I focus on?', icon: 'trending-up-outline' },
    { text: 'I need some encouragement', icon: 'heart-outline' },
    { text: 'Suggest a new practice', icon: 'rocket-outline' },
  ];

  constructor() {
    addIcons({
      sendOutline,
      send,
      sparklesOutline,
      sparkles,
      chatbubblesOutline,
      chatbubbles,
      ribbonOutline,
      bulbOutline,
      eyeOutline,
      leafOutline,
      refreshOutline,
      happyOutline,
      rocketOutline,
      trendingUpOutline,
      heartOutline,
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

  loadInsights(): void {
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

  getInsightColor(type: string): string {
    const colors: Record<string, string> = {
      celebration: '#22c55e', // green-500
      encouragement: '#f59e0b', // amber-500
      suggestion: '#3b82f6', // blue-500
      observation: '#8b5cf6', // violet-500
    };
    return colors[type] || '#22c55e';
  }

  getInsightBackground(type: string): string {
    const backgrounds: Record<string, string> = {
      celebration: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      encouragement: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
      suggestion: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      observation: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    };
    return backgrounds[type] || 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
  }

  getInsightGradient(type: string): string {
    const gradients: Record<string, string> = {
      celebration: 'linear-gradient(135deg, #bbf7d0, #dcfce7)',
      encouragement: 'linear-gradient(135deg, #fde68a, #fef3c7)',
      suggestion: 'linear-gradient(135deg, #bfdbfe, #dbeafe)',
      observation: 'linear-gradient(135deg, #ddd6fe, #ede9fe)',
    };
    return gradients[type] || 'linear-gradient(135deg, #bbf7d0, #dcfce7)';
  }

  getInsightChipColor(type: string): string {
    const colors: Record<string, string> = {
      celebration: 'rgba(34, 197, 94, 0.15)',
      encouragement: 'rgba(245, 158, 11, 0.15)',
      suggestion: 'rgba(59, 130, 246, 0.15)',
      observation: 'rgba(139, 92, 246, 0.15)',
    };
    return colors[type] || 'rgba(34, 197, 94, 0.15)';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
