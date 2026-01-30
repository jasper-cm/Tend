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
      <!-- Hero Section -->
      <div class="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg">
        <!-- Decorative elements -->
        <div class="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-lg"></div>
        <div class="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl lg:text-4xl font-bold mb-2">Garden Guide</h1>
              <p class="text-white/90 max-w-lg">
                Your AI-powered life coach. Ask questions and receive personalized guidance for your growth journey.
              </p>
            </div>
            <div class="hidden md:block">
              <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span class="text-4xl">✨</span>
              </div>
            </div>
          </div>

          <!-- Toggle Button -->
          <div class="mt-6">
            <button
              (click)="toggleInsights()"
              class="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-medium flex items-center gap-2"
            >
              @if (showInsights()) {
                <span>💬</span>
                <span>Open Chat</span>
              } @else {
                <span>💡</span>
                <span>View Insights</span>
              }
            </button>
          </div>
        </div>
      </div>

      @if (showInsights()) {
        <!-- Insights Panel -->
        <div class="space-y-4">
          @if (loadingInsights()) {
            <div class="flex flex-col items-center justify-center py-16">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center animate-pulse mb-4">
                <span class="text-3xl">✨</span>
              </div>
              <p class="text-gray-500">Gathering insights...</p>
            </div>
          } @else {
            <!-- Summary Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl">🌟</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 mb-1">Garden Summary</h3>
                  <p class="text-gray-600">{{ insightsSummary() }}</p>
                </div>
              </div>
            </div>

            @if (insights().length === 0) {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span class="text-4xl">🌱</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">All is Well!</h3>
                <p class="text-gray-500">No specific insights right now. Your garden is flourishing!</p>
              </div>
            } @else {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100">
                  <h2 class="text-lg font-semibold text-gray-800">Personalized Insights</h2>
                  <p class="text-sm text-gray-500">{{ insights().length }} insights for your growth</p>
                </div>
                <div class="divide-y divide-gray-100">
                  @for (insight of insights(); track $index) {
                    <div class="p-5 hover:bg-gray-50 transition-colors">
                      <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                             [style.background]="getInsightGradient(insight.type)">
                          <span class="text-2xl">{{ getInsightIcon(insight.type) }}</span>
                        </div>
                        <div class="flex-1">
                          <h4 class="font-semibold text-gray-800 mb-1">{{ insight.title }}</h4>
                          <p class="text-gray-600 text-sm">{{ insight.message }}</p>
                          @if (insight.lifeArea) {
                            <span class="inline-block mt-2 px-3 py-1 bg-spirit-100 text-spirit-700 text-xs rounded-full">
                              {{ insight.lifeArea }}
                            </span>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          }
        </div>
      } @else {
        <!-- Chat Interface -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style="height: 550px;">
          <!-- Chat Messages -->
          <div #chatContainer class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            @if (messages().length === 0) {
              <div class="text-center py-12">
                <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span class="text-4xl">🌿</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Welcome to the Garden Guide</h3>
                <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  I'm here to help you tend your life garden. Ask me about your progress,
                  get suggestions for practices, or just chat about how you're doing.
                </p>

                <!-- Quick Prompts -->
                <div class="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                  @for (prompt of quickPromptsWithIcons; track prompt.text) {
                    <button
                      (click)="sendMessage(prompt.text)"
                      class="p-4 bg-white rounded-xl text-left hover:shadow-md transition-all group border border-gray-100"
                    >
                      <div class="flex items-center gap-3">
                        <span class="text-2xl group-hover:scale-110 transition-transform">{{ prompt.icon }}</span>
                        <span class="text-sm text-gray-700">{{ prompt.text }}</span>
                      </div>
                    </button>
                  }
                </div>
              </div>
            } @else {
              @for (message of messages(); track $index) {
                <div class="flex" [class.justify-end]="message.role === 'user'">
                  <div
                    class="max-w-[80%] rounded-2xl px-4 py-3 shadow-sm"
                    [class.bg-gradient-to-br]="message.role === 'user'"
                    [class.from-spirit-500]="message.role === 'user'"
                    [class.to-spirit-600]="message.role === 'user'"
                    [class.text-white]="message.role === 'user'"
                    [class.bg-white]="message.role === 'assistant'"
                    [class.text-gray-800]="message.role === 'assistant'"
                  >
                    @if (message.role === 'assistant') {
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-lg">✨</span>
                        <span class="text-xs font-medium text-purple-600">Garden Guide</span>
                      </div>
                    }
                    <p class="whitespace-pre-line">{{ message.content }}</p>
                    <div class="text-xs mt-2 opacity-70" [class.text-right]="message.role === 'user'">
                      {{ formatTime(message.timestamp) }}
                    </div>
                  </div>
                </div>
              }

              @if (isTyping()) {
                <div class="flex">
                  <div class="bg-white rounded-2xl px-4 py-3 shadow-sm">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-lg">✨</span>
                      <span class="text-xs font-medium text-purple-600">Garden Guide</span>
                    </div>
                    <div class="flex gap-1.5 py-1">
                      <span class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></span>
                      <span class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></span>
                      <span class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></span>
                    </div>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Input Area -->
          <div class="border-t border-gray-100 p-4 bg-white">
            <div class="flex gap-3">
              <input
                type="text"
                [(ngModel)]="inputMessage"
                (keyup.enter)="sendMessage()"
                [disabled]="isTyping()"
                class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all"
                placeholder="Ask the Garden Guide..."
              />
              <button
                (click)="sendMessage()"
                [disabled]="!inputMessage.trim() || isTyping()"
                class="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
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

  quickPromptsWithIcons = [
    { icon: '🌿', text: 'How is my garden doing?' },
    { icon: '🎯', text: 'What should I focus on?' },
    { icon: '📈', text: 'Show me my progress' },
    { icon: '💪', text: 'I need some encouragement' },
  ];

  private insightGradients: Record<string, string> = {
    celebration: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    encouragement: 'linear-gradient(135deg, #FF9800, #FFB74D)',
    suggestion: 'linear-gradient(135deg, #2196F3, #64B5F6)',
    observation: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
  };

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

  getInsightGradient(type: string): string {
    return this.insightGradients[type] || 'linear-gradient(135deg, #9C27B0, #BA68C8)';
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
