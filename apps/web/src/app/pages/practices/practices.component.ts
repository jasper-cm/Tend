import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Practice } from '../../services/api.service';

@Component({
  selector: 'tend-practices',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Hero Section -->
      <div class="bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg">
        <!-- Decorative elements -->
        <div class="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-lg"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl lg:text-4xl font-bold mb-2">Practices</h1>
              <p class="text-white/90 max-w-lg">
                The habits, routines, and actions you cultivate to tend your life garden.
              </p>
            </div>
            <div class="hidden md:block">
              <div class="text-5xl">💪</div>
            </div>
          </div>

          <!-- Stats Row -->
          @if (practices().length > 0) {
            <div class="flex gap-8 mt-6">
              <div>
                <span class="text-3xl font-bold">{{ totalStreakDays() }}</span>
                <span class="text-white/70 text-sm block">Total Streak Days</span>
              </div>
              <div>
                <span class="text-3xl font-bold">{{ longestStreak() }}</span>
                <span class="text-white/70 text-sm block">Longest Streak</span>
              </div>
              <div>
                <span class="text-3xl font-bold">{{ onStreakCount() }}</span>
                <span class="text-white/70 text-sm block">Active Streaks</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex gap-2">
        <button
          (click)="filterBy('all')"
          [class.bg-spirit-500]="filter() === 'all'"
          [class.text-white]="filter() === 'all'"
          [class.bg-gray-100]="filter() !== 'all'"
          [class.text-gray-600]="filter() !== 'all'"
          class="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          All ({{ practices().length }})
        </button>
        <button
          (click)="filterBy('active')"
          [class.bg-spirit-500]="filter() === 'active'"
          [class.text-white]="filter() === 'active'"
          [class.bg-gray-100]="filter() !== 'active'"
          [class.text-gray-600]="filter() !== 'active'"
          class="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          Active
        </button>
        <button
          (click)="filterBy('streaks')"
          [class.bg-spirit-500]="filter() === 'streaks'"
          [class.text-white]="filter() === 'streaks'"
          [class.bg-gray-100]="filter() !== 'streaks'"
          [class.text-gray-600]="filter() !== 'streaks'"
          class="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
        >
          On Streak
        </button>
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-16">
          <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center animate-pulse mb-4">
            <span class="text-3xl">💪</span>
          </div>
          <p class="text-gray-500">Loading practices...</p>
        </div>
      } @else {
        @if (filteredPractices().length === 0) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-4xl">🌱</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {{ filter() === 'all' ? 'No practices yet' : 'No matching practices' }}
            </h3>
            <p class="text-gray-500 mb-6">
              {{ filter() === 'all' ? 'Add practices to start building healthy habits.' : 'Try a different filter to see more.' }}
            </p>
            @if (filter() === 'all') {
              <button class="inline-flex items-center gap-2 px-6 py-3 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors font-medium">
                <span>Add Your First Practice</span>
                <span>&rarr;</span>
              </button>
            }
          </div>
        } @else {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="divide-y divide-gray-100">
              @for (practice of filteredPractices(); track practice.id) {
                <div class="p-4 hover:bg-gray-50 transition-colors">
                  <div class="flex items-start gap-4">
                    <!-- Icon -->
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                         [style.background]="getCategoryGradient(practice.category)">
                      <span class="text-2xl">{{ getCategoryEmoji(practice.category) }}</span>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-gray-800">{{ practice.name }}</h3>
                        @if (!practice.isActive) {
                          <span class="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Paused</span>
                        }
                      </div>
                      <p class="text-gray-500 text-sm mb-2">{{ practice.description }}</p>
                      <div class="flex items-center gap-2 flex-wrap">
                        <a
                          [routerLink]="['/life-areas', practice.lifeAreaId]"
                          class="text-xs px-2.5 py-1 bg-spirit-100 text-spirit-700 rounded-full hover:bg-spirit-200 transition-colors"
                        >
                          {{ practice.lifeArea?.name || 'Unknown Area' }}
                        </a>
                        <span class="text-xs px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full">{{ practice.category }}</span>
                        <span class="text-xs text-gray-400">{{ practice.frequency }}</span>
                      </div>
                    </div>

                    <!-- Streak -->
                    <div class="text-right flex-shrink-0">
                      @if (practice.currentStreak > 0) {
                        <div class="flex items-center gap-1.5">
                          <span class="text-2xl">🔥</span>
                          <span class="text-2xl font-bold text-orange-500">{{ practice.currentStreak }}</span>
                        </div>
                        <div class="text-xs text-gray-500">day streak</div>
                        @if (practice.longestStreak > practice.currentStreak) {
                          <div class="text-xs text-gray-400 mt-1">Best: {{ practice.longestStreak }}</div>
                        }
                      } @else {
                        <div class="text-gray-400 text-sm">No streak</div>
                        @if (practice.longestStreak > 0) {
                          <div class="text-xs text-gray-400 mt-1">Best: {{ practice.longestStreak }}</div>
                        }
                      }
                    </div>
                  </div>

                  <!-- Log Button -->
                  <button
                    (click)="logPractice(practice)"
                    [disabled]="!practice.isActive"
                    class="mt-4 w-full py-2.5 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    @if (practice.isActive) {
                      <span>✓</span>
                      <span>Log Completion</span>
                    } @else {
                      <span>Practice Paused</span>
                    }
                  </button>
                </div>
              }
            </div>
          </div>
        }

        <!-- Suggested Practices (when empty) -->
        @if (practices().length === 0) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800">Suggested Practices</h2>
              <p class="text-sm text-gray-500">Popular practices to get you started</p>
            </div>
            <div class="divide-y divide-gray-100">
              @for (suggestion of suggestedPractices; track suggestion.name) {
                <div class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center" [style.background]="suggestion.gradient">
                    <span class="text-2xl">{{ suggestion.emoji }}</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-800">{{ suggestion.name }}</h3>
                    <p class="text-sm text-gray-500">{{ suggestion.description }}</p>
                  </div>
                  <button class="w-10 h-10 rounded-full bg-spirit-100 text-spirit-600 flex items-center justify-center hover:bg-spirit-200 transition-colors">
                    +
                  </button>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class PracticesComponent implements OnInit {
  private api = inject(ApiService);

  practices = signal<Practice[]>([]);
  loading = signal(true);
  filter = signal<'all' | 'active' | 'streaks'>('all');

  totalStreakDays = signal(0);
  longestStreak = signal(0);
  onStreakCount = signal(0);

  suggestedPractices = [
    { name: 'Morning Meditation', emoji: '🧘', description: '10 minutes of mindfulness', gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)' },
    { name: 'Daily Exercise', emoji: '🏃', description: '30 minutes of movement', gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)' },
    { name: 'Gratitude Journal', emoji: '📝', description: 'Write 3 things you\'re grateful for', gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
    { name: 'Reading', emoji: '📚', description: 'Read for 20 minutes', gradient: 'linear-gradient(135deg, #2196F3, #64B5F6)' },
    { name: 'Hydration', emoji: '💧', description: 'Drink 8 glasses of water', gradient: 'linear-gradient(135deg, #00BCD4, #4DD0E1)' },
  ];

  private categoryEmojis: Record<string, string> = {
    habit: '🔄', routine: '📋', ritual: '✨', exercise: '💪',
    meditation: '🧘', reading: '📚', writing: '✍️', health: '❤️',
  };

  private categoryGradients: Record<string, string> = {
    habit: 'linear-gradient(135deg, #9C27B0, #BA68C8)',
    routine: 'linear-gradient(135deg, #2196F3, #64B5F6)',
    ritual: 'linear-gradient(135deg, #FF9800, #FFB74D)',
    exercise: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    meditation: 'linear-gradient(135deg, #673AB7, #9575CD)',
    reading: 'linear-gradient(135deg, #3F51B5, #7986CB)',
    writing: 'linear-gradient(135deg, #00BCD4, #4DD0E1)',
    health: 'linear-gradient(135deg, #E91E63, #F48FB1)',
  };

  ngOnInit(): void {
    this.loadPractices();
  }

  private loadPractices(): void {
    this.api.getPractices().subscribe({
      next: (practices) => {
        this.practices.set(practices);

        const streaks = practices.filter(p => p.currentStreak > 0);
        this.totalStreakDays.set(
          practices.reduce((sum, p) => sum + p.currentStreak, 0)
        );
        this.longestStreak.set(
          Math.max(...practices.map(p => p.currentStreak), 0)
        );
        this.onStreakCount.set(streaks.length);

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  filteredPractices(): Practice[] {
    const all = this.practices();
    switch (this.filter()) {
      case 'active':
        return all.filter(p => p.isActive);
      case 'streaks':
        return all.filter(p => p.currentStreak > 0);
      default:
        return all;
    }
  }

  filterBy(filter: 'all' | 'active' | 'streaks'): void {
    this.filter.set(filter);
  }

  logPractice(practice: Practice): void {
    this.api.logPractice(practice.id, {}).subscribe({
      next: () => {
        const updated = this.practices().map(p =>
          p.id === practice.id
            ? { ...p, currentStreak: p.currentStreak + 1 }
            : p
        );
        this.practices.set(updated);

        this.totalStreakDays.set(this.totalStreakDays() + 1);
        if (practice.currentStreak + 1 > this.longestStreak()) {
          this.longestStreak.set(practice.currentStreak + 1);
        }
        if (practice.currentStreak === 0) {
          this.onStreakCount.set(this.onStreakCount() + 1);
        }
      },
    });
  }

  getCategoryEmoji(category: string): string {
    return this.categoryEmojis[category.toLowerCase()] || '💪';
  }

  getCategoryGradient(category: string): string {
    return this.categoryGradients[category.toLowerCase()] || 'linear-gradient(135deg, #FF9800, #FFB74D)';
  }
}
