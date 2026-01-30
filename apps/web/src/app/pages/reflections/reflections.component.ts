import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Reflection, LifeArea } from '../../services/api.service';

@Component({
  selector: 'tend-reflections',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Hero Section -->
      <div class="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg">
        <!-- Decorative elements -->
        <div class="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-lg"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl lg:text-4xl font-bold mb-2">Reflections</h1>
              <p class="text-white/90 max-w-lg">
                Journal entries and reflections on your growth across life areas.
              </p>
            </div>
            <div class="hidden md:block">
              <div class="text-5xl">📝</div>
            </div>
          </div>

          <!-- Stats Row -->
          @if (reflections().length > 0) {
            <div class="flex gap-8 mt-6">
              <div>
                <span class="text-3xl font-bold">{{ reflections().length }}</span>
                <span class="text-white/70 text-sm block">Total Entries</span>
              </div>
              <div>
                <span class="text-3xl font-bold">{{ getReflectionStreak() }}</span>
                <span class="text-white/70 text-sm block">Day Streak</span>
              </div>
              <div>
                <span class="text-3xl font-bold">{{ getMostFrequentMood() }}</span>
                <span class="text-white/70 text-sm block">Recent Mood</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex justify-end">
        <button
          (click)="toggleNewReflection()"
          class="px-5 py-2.5 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors font-medium flex items-center gap-2 shadow-sm"
        >
          @if (showNewReflection()) {
            <span>&times;</span>
            <span>Cancel</span>
          } @else {
            <span>+</span>
            <span>New Reflection</span>
          }
        </button>
      </div>

      <!-- New Reflection Form -->
      @if (showNewReflection()) {
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 class="text-lg font-semibold text-gray-800">Write a Reflection</h3>
            <p class="text-sm text-gray-500">Capture your thoughts, feelings, and insights</p>
          </div>

          <div class="p-6 space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                [(ngModel)]="newReflection.title"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spirit-500 focus:border-transparent transition-all"
                placeholder="What's on your mind?"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
              <div class="flex gap-2">
                @for (mood of moods; track mood.value) {
                  <button
                    (click)="newReflection.mood = mood.value"
                    [class.ring-2]="newReflection.mood === mood.value"
                    [class.ring-spirit-500]="newReflection.mood === mood.value"
                    [class.bg-spirit-50]="newReflection.mood === mood.value"
                    class="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all text-2xl flex items-center justify-center"
                    [title]="mood.label"
                  >
                    {{ mood.emoji }}
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Your Reflection</label>
              <textarea
                [(ngModel)]="newReflection.content"
                rows="5"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spirit-500 focus:border-transparent transition-all resize-none"
                placeholder="Write your thoughts, observations, and insights..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Related Life Areas</label>
              <div class="flex flex-wrap gap-2">
                @for (area of lifeAreas(); track area.id) {
                  <button
                    (click)="toggleLifeArea(area.id)"
                    [class.bg-spirit-500]="selectedLifeAreas().includes(area.id)"
                    [class.text-white]="selectedLifeAreas().includes(area.id)"
                    [class.bg-gray-100]="!selectedLifeAreas().includes(area.id)"
                    [class.text-gray-600]="!selectedLifeAreas().includes(area.id)"
                    class="px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-sm"
                  >
                    {{ area.name }}
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gratitude (optional)</label>
              <input
                type="text"
                [(ngModel)]="gratitudeInput"
                (keyup.enter)="addGratitude()"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-spirit-500 focus:border-transparent transition-all"
                placeholder="What are you grateful for? Press Enter to add"
              />
              @if (newReflection.gratitude.length > 0) {
                <div class="flex flex-wrap gap-2 mt-3">
                  @for (item of newReflection.gratitude; track $index) {
                    <span class="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-2">
                      <span>✨</span>
                      {{ item }}
                      <button (click)="removeGratitude($index)" class="text-amber-600 hover:text-amber-800 ml-1">&times;</button>
                    </span>
                  }
                </div>
              }
            </div>

            <button
              (click)="saveReflection()"
              [disabled]="!newReflection.title || !newReflection.content"
              class="w-full py-3 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Save Reflection</span>
            </button>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-16">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse mb-4">
            <span class="text-3xl">📝</span>
          </div>
          <p class="text-gray-500">Loading reflections...</p>
        </div>
      } @else {
        @if (reflections().length === 0 && !showNewReflection()) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-4xl">📝</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No reflections yet</h3>
            <p class="text-gray-500 mb-6 max-w-md mx-auto">
              Start journaling to track your growth and insights. Writing helps you understand yourself better.
            </p>
            <button
              (click)="toggleNewReflection()"
              class="inline-flex items-center gap-2 px-6 py-3 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors font-medium"
            >
              <span>Write Your First Reflection</span>
              <span>&rarr;</span>
            </button>

            <!-- Writing Prompts -->
            <div class="mt-8 text-left">
              <h4 class="text-sm font-medium text-gray-700 mb-3 text-center">Need inspiration? Try these prompts:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                @for (prompt of writingPrompts; track prompt.text) {
                  <button
                    (click)="usePrompt(prompt.text)"
                    class="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">{{ prompt.emoji }}</span>
                      <p class="text-sm text-gray-600 group-hover:text-gray-800">{{ prompt.text }}</p>
                    </div>
                  </button>
                }
              </div>
            </div>
          </div>
        } @else if (reflections().length > 0) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800">Your Reflections</h2>
              <p class="text-sm text-gray-500">{{ reflections().length }} entries in your journal</p>
            </div>

            <div class="divide-y divide-gray-100">
              @for (reflection of reflections(); track reflection.id) {
                <div class="p-5 hover:bg-gray-50 transition-colors">
                  <div class="flex items-start gap-4">
                    <!-- Mood indicator -->
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                         [style.background]="getMoodGradient(reflection.mood || 'okay')">
                      <span class="text-2xl">{{ getMoodEmoji(reflection.mood || 'okay') }}</span>
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between mb-2">
                        <div>
                          <h3 class="font-semibold text-gray-800 text-lg">{{ reflection.title }}</h3>
                          <div class="text-xs text-gray-400 mt-0.5">
                            {{ formatDate(reflection.createdAt) }}
                          </div>
                        </div>
                      </div>

                      <p class="text-gray-600 whitespace-pre-line line-clamp-3">{{ reflection.content }}</p>

                      @if (reflection.gratitude && reflection.gratitude.length > 0) {
                        <div class="mt-3 flex flex-wrap gap-2">
                          @for (item of reflection.gratitude; track $index) {
                            <span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs flex items-center gap-1">
                              <span>✨</span>
                              {{ item }}
                            </span>
                          }
                        </div>
                      }

                      @if (reflection.lifeAreas && reflection.lifeAreas.length > 0) {
                        <div class="mt-3 flex flex-wrap gap-2">
                          @for (la of reflection.lifeAreas; track la.lifeArea.id) {
                            <a
                              [routerLink]="['/life-areas', la.lifeArea.id]"
                              class="px-2.5 py-1 bg-spirit-100 text-spirit-700 rounded-full text-xs hover:bg-spirit-200 transition-colors"
                            >
                              {{ la.lifeArea.name }}
                            </a>
                          }
                        </div>
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
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export class ReflectionsComponent implements OnInit {
  private api = inject(ApiService);

  reflections = signal<Reflection[]>([]);
  lifeAreas = signal<LifeArea[]>([]);
  loading = signal(true);
  showNewReflection = signal(false);
  selectedLifeAreas = signal<string[]>([]);

  newReflection = {
    title: '',
    content: '',
    mood: '',
    gratitude: [] as string[],
  };
  gratitudeInput = '';

  moods = [
    { value: 'great', emoji: '😊', label: 'Great' },
    { value: 'good', emoji: '🙂', label: 'Good' },
    { value: 'okay', emoji: '😐', label: 'Okay' },
    { value: 'low', emoji: '😔', label: 'Low' },
    { value: 'difficult', emoji: '😢', label: 'Difficult' },
  ];

  writingPrompts = [
    { emoji: '🌟', text: 'What am I most proud of today?' },
    { emoji: '🌱', text: 'What did I learn recently?' },
    { emoji: '💭', text: 'What\'s been on my mind lately?' },
    { emoji: '🎯', text: 'What goals am I working towards?' },
  ];

  private moodGradients: Record<string, string> = {
    great: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    good: 'linear-gradient(135deg, #8BC34A, #CDDC39)',
    okay: 'linear-gradient(135deg, #FF9800, #FFB74D)',
    neutral: 'linear-gradient(135deg, #9E9E9E, #BDBDBD)',
    low: 'linear-gradient(135deg, #FF5722, #FF8A65)',
    difficult: 'linear-gradient(135deg, #f44336, #E57373)',
  };

  private moodEmojis: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    neutral: '😐',
    low: '😔',
    difficult: '😢',
  };

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.api.getReflections().subscribe({
      next: (reflections) => {
        this.reflections.set(reflections);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });

    this.api.getLifeAreas().subscribe({
      next: (areas) => {
        this.lifeAreas.set(areas);
      },
    });
  }

  toggleNewReflection(): void {
    this.showNewReflection.set(!this.showNewReflection());
    if (!this.showNewReflection()) {
      this.resetForm();
    }
  }

  toggleLifeArea(id: string): void {
    const current = this.selectedLifeAreas();
    if (current.includes(id)) {
      this.selectedLifeAreas.set(current.filter(a => a !== id));
    } else {
      this.selectedLifeAreas.set([...current, id]);
    }
  }

  addGratitude(): void {
    if (this.gratitudeInput.trim()) {
      this.newReflection.gratitude.push(this.gratitudeInput.trim());
      this.gratitudeInput = '';
    }
  }

  removeGratitude(index: number): void {
    this.newReflection.gratitude.splice(index, 1);
  }

  saveReflection(): void {
    if (!this.newReflection.title || !this.newReflection.content) return;

    this.api.createReflection({
      title: this.newReflection.title,
      content: this.newReflection.content,
      mood: this.newReflection.mood || undefined,
      gratitude: this.newReflection.gratitude,
      lifeAreaIds: this.selectedLifeAreas(),
      userId: 'demo-user',
    }).subscribe({
      next: (reflection) => {
        this.reflections.set([reflection, ...this.reflections()]);
        this.showNewReflection.set(false);
        this.resetForm();
      },
    });
  }

  private resetForm(): void {
    this.newReflection = {
      title: '',
      content: '',
      mood: '',
      gratitude: [],
    };
    this.gratitudeInput = '';
    this.selectedLifeAreas.set([]);
  }

  getMoodEmoji(mood: string): string {
    return this.moodEmojis[mood.toLowerCase()] || '😐';
  }

  getMoodGradient(mood: string): string {
    return this.moodGradients[mood.toLowerCase()] || 'linear-gradient(135deg, #FF9800, #FFB74D)';
  }

  getReflectionStreak(): number {
    // Simple streak calculation based on consecutive days
    if (this.reflections().length === 0) return 0;
    return Math.min(this.reflections().length, 7); // Simplified for demo
  }

  getMostFrequentMood(): string {
    const refs = this.reflections();
    if (refs.length === 0) return '😐';
    const recent = refs[0];
    return this.getMoodEmoji(recent?.mood || 'okay');
  }

  usePrompt(promptText: string): void {
    this.newReflection.title = promptText;
    this.showNewReflection.set(true);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
