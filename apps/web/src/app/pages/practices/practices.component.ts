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
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-earth-800">Practices</h2>
          <p class="text-earth-600">
            The habits, routines, and actions you cultivate to tend your life garden.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            (click)="filterBy('all')"
            [class.bg-spirit-500]="filter() === 'all'"
            [class.text-white]="filter() === 'all'"
            [class.bg-parchment]="filter() !== 'all'"
            class="px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            All
          </button>
          <button
            (click)="filterBy('active')"
            [class.bg-spirit-500]="filter() === 'active'"
            [class.text-white]="filter() === 'active'"
            [class.bg-parchment]="filter() !== 'active'"
            class="px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            Active
          </button>
          <button
            (click)="filterBy('streaks')"
            [class.bg-spirit-500]="filter() === 'streaks'"
            [class.text-white]="filter() === 'streaks'"
            [class.bg-parchment]="filter() !== 'streaks'"
            class="px-3 py-1 rounded text-sm font-medium transition-colors"
          >
            On Streak
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-pulse text-sage-500">Loading practices...</div>
        </div>
      } @else {
        <!-- Streak Summary -->
        @if (practices().length > 0) {
          <div class="bg-gradient-to-r from-spirit-500 to-spirit-400 rounded-soft p-4 text-white">
            <div class="flex flex-wrap gap-6 justify-around text-center">
              <div>
                <div class="text-3xl font-bold">{{ totalStreakDays() }}</div>
                <div class="text-sm opacity-90">Total Streak Days</div>
              </div>
              <div>
                <div class="text-3xl font-bold">{{ longestStreak() }}</div>
                <div class="text-sm opacity-90">Longest Streak</div>
              </div>
              <div>
                <div class="text-3xl font-bold">{{ onStreakCount() }}</div>
                <div class="text-sm opacity-90">Active Streaks</div>
              </div>
            </div>
          </div>
        }

        @if (filteredPractices().length === 0) {
          <div class="bg-parchment rounded-soft p-8 text-center border border-sage-300/30">
            <div class="text-4xl mb-4">🌱</div>
            <h3 class="text-lg font-medium text-earth-800 mb-2">
              {{ filter() === 'all' ? 'No practices yet' : 'No matching practices' }}
            </h3>
            <p class="text-earth-600">
              {{ filter() === 'all' ? 'Add practices to start building healthy habits.' : 'Try a different filter.' }}
            </p>
          </div>
        } @else {
          <div class="space-y-3">
            @for (practice of filteredPractices(); track practice.id) {
              <div class="bg-parchment rounded-soft p-4 border border-sage-300/30 hover:border-spirit-400/50 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <h3 class="font-semibold text-earth-800">{{ practice.name }}</h3>
                      @if (!practice.isActive) {
                        <span class="px-2 py-0.5 bg-earth-300/20 text-earth-600 text-xs rounded">Paused</span>
                      }
                    </div>
                    <p class="text-earth-600 text-sm mt-1">{{ practice.description }}</p>
                    <div class="flex items-center gap-3 mt-2">
                      <a
                        [routerLink]="['/life-areas', practice.lifeAreaId]"
                        class="text-xs px-2 py-1 bg-sage-200/30 rounded text-spirit-600 hover:bg-sage-300/40 transition-colors"
                      >
                        {{ practice.lifeArea?.name || 'Unknown Area' }}
                      </a>
                      <span class="text-xs px-2 py-1 bg-golden-200/30 rounded text-earth-800">{{ practice.category }}</span>
                      <span class="text-xs text-earth-600">{{ practice.frequency }}</span>
                    </div>
                  </div>
                  <div class="text-right ml-4">
                    @if (practice.currentStreak > 0) {
                      <div class="flex items-center gap-1">
                        <span class="text-2xl">🔥</span>
                        <span class="text-2xl font-bold text-spirit-600">{{ practice.currentStreak }}</span>
                      </div>
                      <div class="text-xs text-earth-600">day streak</div>
                      @if (practice.longestStreak > practice.currentStreak) {
                        <div class="text-xs text-earth-400 mt-1">Best: {{ practice.longestStreak }}</div>
                      }
                    } @else {
                      <div class="text-earth-400 text-sm">No streak</div>
                      @if (practice.longestStreak > 0) {
                        <div class="text-xs text-earth-400">Best: {{ practice.longestStreak }}</div>
                      }
                    }
                  </div>
                </div>
                <button
                  (click)="logPractice(practice)"
                  [disabled]="!practice.isActive"
                  class="mt-3 w-full py-2 bg-spirit-500 text-white rounded hover:bg-spirit-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ practice.isActive ? 'Log Completion' : 'Practice Paused' }}
                </button>
              </div>
            }
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
}
