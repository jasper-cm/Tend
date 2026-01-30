import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Practice } from '../../services/api.service';

@Component({
  selector: 'tend-practices',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <!-- Hero Section - Spiritual/Meditative -->
      <div class="bg-gradient-to-br from-green-50 via-white to-emerald-50/50 rounded-3xl p-8 lg:p-10 relative overflow-hidden border border-green-100/50 shadow-xl shadow-green-100/20">
        <!-- Decorative elements -->
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-green-100/40 to-transparent rounded-full blur-2xl"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between gap-8">
            <div class="flex-1">
              <h1 class="text-3xl lg:text-4xl font-semibold text-gray-800 mb-3 tracking-tight">Practices</h1>
              <p class="text-gray-600 max-w-lg leading-relaxed">
                The mindful habits, rituals, and actions you cultivate to nurture your inner garden.
              </p>
            </div>
            <div class="hidden md:block">
              <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200/30">
                <span class="text-4xl">🧘</span>
              </div>
            </div>
          </div>

          <!-- Stats Row -->
          @if (practices().length > 0) {
            <div class="flex gap-10 mt-8 pt-6 border-t border-green-100/50">
              <div class="text-center">
                <span class="text-3xl font-semibold text-gray-800">{{ totalStreakDays() }}</span>
                <span class="text-green-600/70 text-sm block mt-1">Total Streak Days</span>
              </div>
              <div class="text-center">
                <span class="text-3xl font-semibold text-green-600">{{ longestStreak() }}</span>
                <span class="text-green-600/70 text-sm block mt-1">Longest Streak</span>
              </div>
              <div class="text-center">
                <span class="text-3xl font-semibold text-gray-800">{{ onStreakCount() }}</span>
                <span class="text-green-600/70 text-sm block mt-1">Active Streaks</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Filter Tabs - Zen Style -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100/50 p-1.5 flex gap-1.5 shadow-sm">
        <button
          (click)="filterBy('all')"
          [class.bg-gradient-to-r]="filter() === 'all'"
          [class.from-green-500]="filter() === 'all'"
          [class.to-emerald-500]="filter() === 'all'"
          [class.text-white]="filter() === 'all'"
          [class.shadow-md]="filter() === 'all'"
          [class.bg-transparent]="filter() !== 'all'"
          [class.text-gray-600]="filter() !== 'all'"
          [class.hover:bg-green-50]="filter() !== 'all'"
          class="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
        >
          All ({{ practices().length }})
        </button>
        <button
          (click)="filterBy('active')"
          [class.bg-gradient-to-r]="filter() === 'active'"
          [class.from-green-500]="filter() === 'active'"
          [class.to-emerald-500]="filter() === 'active'"
          [class.text-white]="filter() === 'active'"
          [class.shadow-md]="filter() === 'active'"
          [class.bg-transparent]="filter() !== 'active'"
          [class.text-gray-600]="filter() !== 'active'"
          [class.hover:bg-green-50]="filter() !== 'active'"
          class="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
        >
          Active
        </button>
        <button
          (click)="filterBy('streaks')"
          [class.bg-gradient-to-r]="filter() === 'streaks'"
          [class.from-green-500]="filter() === 'streaks'"
          [class.to-emerald-500]="filter() === 'streaks'"
          [class.text-white]="filter() === 'streaks'"
          [class.shadow-md]="filter() === 'streaks'"
          [class.bg-transparent]="filter() !== 'streaks'"
          [class.text-gray-600]="filter() !== 'streaks'"
          [class.hover:bg-green-50]="filter() !== 'streaks'"
          class="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
        >
          On Streak
        </button>
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-20">
          <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100/50 animate-breathe">
            <span class="text-4xl">🧘</span>
          </div>
          <p class="text-green-600/70 text-lg">Loading practices...</p>
          <div class="flex gap-1.5 mt-4">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      } @else {
        @if (filteredPractices().length === 0) {
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 p-12 text-center shadow-lg shadow-green-100/10">
            <div class="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200/30 animate-breathe">
              <span class="text-5xl">🌱</span>
            </div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-3">
              {{ filter() === 'all' ? 'Begin Your Rituals' : 'No matching practices' }}
            </h3>
            <p class="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              {{ filter() === 'all' ? 'Add practices to cultivate mindful habits and nurture your growth.' : 'Try a different filter to see more.' }}
            </p>
            @if (filter() === 'all') {
              <button class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg shadow-green-200/50 hover:shadow-xl hover:-translate-y-0.5">
                <span>Add Your First Practice</span>
                <span>→</span>
              </button>
            }
          </div>
        } @else {
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 overflow-hidden shadow-lg shadow-green-100/10">
            <div class="divide-y divide-green-50">
              @for (practice of filteredPractices(); track practice.id) {
                <div class="p-6 hover:bg-green-50/30 transition-all duration-300">
                  <div class="flex items-start gap-5">
                    <!-- Icon -->
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                         [style.background]="getCategoryGradient(practice.category)">
                      <span class="text-2xl">{{ getCategoryEmoji(practice.category) }}</span>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-semibold text-gray-800">{{ practice.name }}</h3>
                        @if (!practice.isActive) {
                          <span class="px-2.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Paused</span>
                        }
                      </div>
                      <p class="text-gray-500 text-sm mb-3">{{ practice.description }}</p>
                      <div class="flex items-center gap-2 flex-wrap">
                        <a
                          [routerLink]="['/life-areas', practice.lifeAreaId]"
                          class="text-xs px-3 py-1.5 bg-green-100/70 text-green-700 rounded-full hover:bg-green-200/70 transition-colors"
                        >
                          {{ practice.lifeArea?.name || 'Unknown Area' }}
                        </a>
                        <span class="text-xs px-3 py-1.5 bg-amber-100/70 text-amber-700 rounded-full">{{ practice.category }}</span>
                        <span class="text-xs text-gray-400">{{ practice.frequency }}</span>
                      </div>
                    </div>

                    <!-- Streak -->
                    <div class="text-right flex-shrink-0">
                      @if (practice.currentStreak > 0) {
                        <div class="flex items-center gap-1.5">
                          <span class="text-2xl">🔥</span>
                          <span class="text-2xl font-semibold text-orange-500">{{ practice.currentStreak }}</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">day streak</div>
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
                    class="mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    @if (practice.isActive) {
                      <span>✓</span>
                      <span>Complete Practice</span>
                    } @else {
                      <span>Practice Paused</span>
                    }
                  </button>
                </div>
              }
            </div>
          </div>
        }

        <!-- Suggested Practices (when empty) - Zen Style -->
        @if (practices().length === 0) {
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 overflow-hidden shadow-lg shadow-green-100/10">
            <div class="px-8 py-5 border-b border-green-50">
              <h2 class="text-lg font-semibold text-gray-800">Suggested Practices</h2>
              <p class="text-sm text-green-600/60">Popular practices to begin your journey</p>
            </div>
            <div class="divide-y divide-green-50">
              @for (suggestion of suggestedPractices; track suggestion.name) {
                <div class="p-5 flex items-center gap-4 hover:bg-green-50/30 transition-all duration-300 cursor-pointer group">
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105" [style.background]="suggestion.gradient">
                    <span class="text-2xl">{{ suggestion.emoji }}</span>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">{{ suggestion.name }}</h3>
                    <p class="text-sm text-gray-500 mt-0.5">{{ suggestion.description }}</p>
                  </div>
                  <button class="w-11 h-11 rounded-xl bg-green-100/70 text-green-600 flex items-center justify-center hover:bg-green-200/70 hover:scale-105 transition-all duration-300 font-semibold">
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
    { name: 'Morning Meditation', emoji: '🧘', description: '10 minutes of mindfulness', gradient: 'linear-gradient(135deg, #c7d2fe, #e0e7ff)' },
    { name: 'Daily Exercise', emoji: '🏃', description: '30 minutes of movement', gradient: 'linear-gradient(135deg, #bbf7d0, #dcfce7)' },
    { name: 'Gratitude Journal', emoji: '📝', description: 'Write 3 things you\'re grateful for', gradient: 'linear-gradient(135deg, #fde68a, #fef3c7)' },
    { name: 'Reading', emoji: '📚', description: 'Read for 20 minutes', gradient: 'linear-gradient(135deg, #bfdbfe, #dbeafe)' },
    { name: 'Hydration', emoji: '💧', description: 'Drink 8 glasses of water', gradient: 'linear-gradient(135deg, #a5f3fc, #cffafe)' },
  ];

  private categoryEmojis: Record<string, string> = {
    habit: '🔄', routine: '📋', ritual: '✨', exercise: '💪',
    meditation: '🧘', reading: '📚', writing: '✍️', health: '❤️',
  };

  private categoryGradients: Record<string, string> = {
    habit: 'linear-gradient(135deg, #c4b5fd, #e9d5ff)',
    routine: 'linear-gradient(135deg, #bae6fd, #e0f2fe)',
    ritual: 'linear-gradient(135deg, #fde68a, #fef3c7)',
    exercise: 'linear-gradient(135deg, #bbf7d0, #dcfce7)',
    meditation: 'linear-gradient(135deg, #c7d2fe, #e0e7ff)',
    reading: 'linear-gradient(135deg, #bfdbfe, #dbeafe)',
    writing: 'linear-gradient(135deg, #a5f3fc, #cffafe)',
    health: 'linear-gradient(135deg, #fecdd3, #ffe4e6)',
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
