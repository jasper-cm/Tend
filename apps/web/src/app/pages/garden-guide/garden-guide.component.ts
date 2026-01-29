import { Component, inject, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Insight } from '../../services/api.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'tend-garden-guide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-soil">Garden Guide</h2>
          <p class="text-bark">
            Your AI-powered life coach. Ask questions and receive personalized guidance.
          </p>
        </div>
        <button
          (click)="toggleInsights()"
          class="px-4 py-2 bg-sun text-soil rounded-lg hover:bg-sun-light transition-colors text-sm font-medium"
        >
          {{ showInsights() ? 'Show Chat' : 'View Insights' }}
        </button>
      </div>

      @if (showInsights()) {
        <!-- Insights Panel -->
        <div class="space-y-4">
          @if (loadingInsights()) {
            <div class="flex items-center justify-center py-12">
              <div class="animate-pulse text-sage">Gathering insights...</div>
            </div>
          } @else {
            <div class="bg-parchment rounded-lg p-4 border border-sage/20">
              <p class="text-bark">{{ insightsSummary() }}</p>
            </div>

            @if (insights().length === 0) {
              <div class="bg-parchment rounded-lg p-8 text-center border border-sage/20">
                <div class="text-4xl mb-4">🌱</div>
                <p class="text-bark">No specific insights right now. Your garden is doing well!</p>
              </div>
            } @else {
              <div class="space-y-3">
                @for (insight of insights(); track $index) {
                  <div
                    class="bg-parchment rounded-lg p-4 border-l-4 transition-colors"
                    [class.border-l-leaf]="insight.type === 'celebration'"
                    [class.border-l-sun]="insight.type === 'encouragement'"
                    [class.border-l-water]="insight.type === 'suggestion'"
                    [class.border-l-bark]="insight.type === 'observation'"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">{{ getInsightIcon(insight.type) }}</span>
                      <div>
                        <h4 class="font-medium text-soil">{{ insight.title }}</h4>
                        <p class="text-bark text-sm mt-1">{{ insight.message }}</p>
                        @if (insight.lifeArea) {
                          <span class="inline-block mt-2 px-2 py-0.5 bg-sage/20 text-leaf text-xs rounded">
                            {{ insight.lifeArea }}
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          }
        </div>
      } @else {
        <!-- Chat Interface -->
        <div class="bg-parchment rounded-lg border border-sage/20 overflow-hidden flex flex-col" style="height: 500px;">
          <!-- Chat Messages -->
          <div #chatContainer class="flex-1 overflow-y-auto p-4 space-y-4">
            @if (messages().length === 0) {
              <div class="text-center py-8">
                <div class="text-5xl mb-4">🌿</div>
                <h3 class="text-lg font-medium text-soil mb-2">Welcome to the Garden Guide</h3>
                <p class="text-bark text-sm max-w-md mx-auto">
                  I'm here to help you tend your life garden. Ask me about your progress,
                  get suggestions for practices, or just chat about how you're doing.
                </p>
                <div class="flex flex-wrap gap-2 justify-center mt-4">
                  @for (prompt of quickPrompts; track prompt) {
                    <button
                      (click)="sendMessage(prompt)"
                      class="px-3 py-1 bg-cream text-soil rounded-full text-sm hover:bg-sage/20 transition-colors"
                    >
                      {{ prompt }}
                    </button>
                  }
                </div>
              </div>
            } @else {
              @for (message of messages(); track $index) {
                <div
                  class="flex"
                  [class.justify-end]="message.role === 'user'"
                >
                  <div
                    class="max-w-[80%] rounded-lg px-4 py-2"
                    [class.bg-leaf]="message.role === 'user'"
                    [class.text-white]="message.role === 'user'"
                    [class.bg-cream]="message.role === 'assistant'"
                    [class.text-soil]="message.role === 'assistant'"
                  >
                    <p class="whitespace-pre-line">{{ message.content }}</p>
                    <div
                      class="text-xs mt-1 opacity-70"
                      [class.text-right]="message.role === 'user'"
                    >
                      {{ formatTime(message.timestamp) }}
                    </div>
                  </div>
                </div>
              }

              @if (isTyping()) {
                <div class="flex">
                  <div class="bg-cream rounded-lg px-4 py-2">
                    <div class="flex gap-1">
                      <span class="w-2 h-2 bg-sage rounded-full animate-bounce" style="animation-delay: 0ms;"></span>
                      <span class="w-2 h-2 bg-sage rounded-full animate-bounce" style="animation-delay: 150ms;"></span>
                      <span class="w-2 h-2 bg-sage rounded-full animate-bounce" style="animation-delay: 300ms;"></span>
                    </div>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Input Area -->
          <div class="border-t border-sage/20 p-4">
            <div class="flex gap-2">
              <input
                type="text"
                [(ngModel)]="inputMessage"
                (keyup.enter)="sendMessage()"
                [disabled]="isTyping()"
                class="flex-1 px-4 py-2 border border-sage/30 rounded-lg focus:outline-none focus:border-leaf disabled:opacity-50"
                placeholder="Ask the Garden Guide..."
              />
              <button
                (click)="sendMessage()"
                [disabled]="!inputMessage.trim() || isTyping()"
                class="px-4 py-2 bg-leaf text-white rounded-lg hover:bg-leaf-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class GardenGuideComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private api = inject(ApiService);

  messages = signal<ChatMessage[]>([]);
  insights = signal<Insight[]>([]);
  insightsSummary = signal('');
  showInsights = signal(false);
  isTyping = signal(false);
  loadingInsights = signal(false);

  inputMessage = '';

  quickPrompts = [
    'How is my garden doing?',
    'What should I focus on?',
    'Show me my progress',
    'I need some encouragement',
  ];

  ngOnInit(): void {
    this.loadInsights();
  }

  toggleInsights(): void {
    this.showInsights.set(!this.showInsights());
    if (this.showInsights() && this.insights().length === 0) {
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
    if (this.chatContainer) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
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
