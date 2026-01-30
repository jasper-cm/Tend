import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, LifeArea, Practice, Reflection } from '../../services/api.service';

@Component({
  selector: 'tend-life-area-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-16">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse mb-4">
            <span class="text-3xl">🌱</span>
          </div>
          <p class="text-gray-500">Loading life area...</p>
        </div>
      } @else if (lifeArea()) {
        <!-- Back Link -->
        <a routerLink="/life-areas" class="inline-flex items-center gap-2 text-gray-500 hover:text-spirit-600 text-sm transition-colors">
          <span>&larr;</span>
          <span>Back to Life Areas</span>
        </a>

        <!-- Hero Section -->
        <div class="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg">
          <!-- Decorative elements -->
          <div class="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
          <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-lg"></div>

          <div class="relative z-10">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                  <span class="text-4xl">{{ getIcon(lifeArea()!.icon) }}</span>
                </div>
                <div>
                  <h1 class="text-3xl lg:text-4xl font-bold mb-2">{{ lifeArea()!.name }}</h1>
                  <p class="text-white/90 max-w-lg">{{ lifeArea()!.description }}</p>
                </div>
              </div>

              <!-- Health Ring -->
              <div class="hidden md:flex flex-col items-center">
                <div class="relative w-24 h-24">
                  <svg class="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" stroke-width="8" fill="none"/>
                    <circle
                      cx="48" cy="48" r="40"
                      stroke="white"
                      stroke-width="8"
                      fill="none"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="251.2"
                      [attr.stroke-dashoffset]="251.2 - (251.2 * lifeArea()!.healthScore / 100)"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-2xl font-bold">{{ lifeArea()!.healthScore }}</span>
                  </div>
                </div>
                <span class="text-sm text-white/80 mt-2">Health Score</span>
              </div>
            </div>

            <!-- Mobile Health Display -->
            <div class="md:hidden mt-6">
              <div class="flex items-center gap-4">
                <div class="text-4xl font-bold">{{ lifeArea()!.healthScore }}%</div>
                <div class="flex-1">
                  <div class="h-3 bg-white/20 rounded-full overflow-hidden">
                    <div class="h-full bg-white rounded-full transition-all duration-500"
                         [style.width.%]="lifeArea()!.healthScore"></div>
                  </div>
                  <span class="text-sm text-white/70 mt-1 block">{{ getHealthLabel(lifeArea()!.healthScore) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div class="text-2xl font-bold text-spirit-600">{{ practices().length }}</div>
            <div class="text-xs text-gray-500 mt-1">Practices</div>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div class="text-2xl font-bold text-orange-500">{{ getTotalStreak() }}</div>
            <div class="text-xs text-gray-500 mt-1">Total Streak</div>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div class="text-2xl font-bold text-blue-500">{{ reflections().length }}</div>
            <div class="text-xs text-gray-500 mt-1">Reflections</div>
          </div>
        </div>

        <!-- Practices Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">Practices</h2>
            <p class="text-sm text-gray-500">Habits that nurture this life area</p>
          </div>

          @if (practices().length === 0) {
            <div class="p-8 text-center">
              <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">💪</span>
              </div>
              <h3 class="font-semibold text-gray-800 mb-2">No practices yet</h3>
              <p class="text-gray-500 text-sm max-w-sm mx-auto">
                Add practices to start nurturing this part of your garden.
              </p>
            </div>
          } @else {
            <div class="divide-y divide-gray-100">
              @for (practice of practices(); track practice.id) {
                <div class="p-4 hover:bg-gray-50 transition-colors">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                         [style.background]="getCategoryGradient(practice.category)">
                      <span class="text-2xl">{{ getCategoryEmoji(practice.category) }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-gray-800">{{ practice.name }}</h4>
                      <p class="text-gray-500 text-sm mt-1">{{ practice.description }}</p>
                      <div class="flex gap-2 mt-2">
                        <span class="px-2.5 py-1 bg-spirit-100 text-spirit-700 rounded-full text-xs">{{ practice.category }}</span>
                        <span class="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">{{ practice.frequency }}</span>
                      </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      @if (practice.currentStreak > 0) {
                        <div class="flex items-center gap-1.5">
                          <span class="text-xl">🔥</span>
                          <span class="text-2xl font-bold text-orange-500">{{ practice.currentStreak }}</span>
                        </div>
                        <div class="text-xs text-gray-500">day streak</div>
                      } @else {
                        <div class="text-gray-400 text-sm">No streak</div>
                      }
                    </div>
                  </div>
                  <button
                    (click)="logPractice(practice)"
                    class="mt-4 w-full py-2.5 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <span>✓</span>
                    <span>Log Completion</span>
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Recent Reflections Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Recent Reflections</h2>
              <p class="text-sm text-gray-500">Journal entries about this life area</p>
            </div>
            <a routerLink="/reflections" class="text-sm text-spirit-600 hover:text-spirit-700 font-medium">
              View all &rarr;
            </a>
          </div>

          @if (reflections().length === 0) {
            <div class="p-8 text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-3xl">📝</span>
              </div>
              <h3 class="font-semibold text-gray-800 mb-2">No reflections yet</h3>
              <p class="text-gray-500 text-sm max-w-sm mx-auto mb-4">
                No reflections tagged with this life area yet.
              </p>
              <a routerLink="/reflections" class="inline-flex items-center gap-2 px-4 py-2 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors text-sm font-medium">
                Write a reflection
              </a>
            </div>
          } @else {
            <div class="divide-y divide-gray-100">
              @for (ref of reflections(); track ref.id) {
                <div class="p-4 hover:bg-gray-50 transition-colors">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                         [style.background]="getMoodGradient(ref.mood || 'okay')">
                      <span class="text-xl">{{ getMoodEmoji(ref.mood || 'okay') }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-semibold text-gray-800">{{ ref.title }}</h4>
                      <p class="text-gray-500 text-sm mt-1 line-clamp-2">{{ ref.content }}</p>
                      <div class="text-xs text-gray-400 mt-2">{{ formatDate(ref.createdAt) }}</div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-4xl">❓</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Life area not found</h3>
          <p class="text-gray-500 mb-6">The life area you're looking for doesn't exist.</p>
          <a routerLink="/life-areas" class="inline-flex items-center gap-2 px-6 py-3 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors font-medium">
            <span>&larr;</span>
            <span>Back to Life Areas</span>
          </a>
        </div>
      }
    </div>
  `,
})
export class LifeAreaDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  lifeArea = signal<LifeArea | null>(null);
  practices = signal<Practice[]>([]);
  reflections = signal<Reflection[]>([]);
  loading = signal(true);

  private iconMap: Record<string, string> = {
    leaf: '🌿',
    heart: '❤️',
    brain: '🧠',
    briefcase: '💼',
    dumbbell: '💪',
    book: '📚',
    palette: '🎨',
    users: '👥',
    dollar: '💰',
    sun: '☀️',
    moon: '🌙',
    star: '⭐',
  };

  private moodEmojis: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    neutral: '😐',
    low: '😔',
    difficult: '😢',
  };

  private moodGradients: Record<string, string> = {
    great: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    good: 'linear-gradient(135deg, #8BC34A, #CDDC39)',
    okay: 'linear-gradient(135deg, #FF9800, #FFB74D)',
    neutral: 'linear-gradient(135deg, #9E9E9E, #BDBDBD)',
    low: 'linear-gradient(135deg, #FF5722, #FF8A65)',
    difficult: 'linear-gradient(135deg, #f44336, #E57373)',
  };

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
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadLifeArea(id);
  }

  private loadLifeArea(id: string): void {
    this.api.getLifeArea(id).subscribe({
      next: (lifeArea) => {
        this.lifeArea.set(lifeArea);
        this.practices.set(lifeArea.practices || []);
        this.reflections.set(
          (lifeArea.reflections || []).map((r) => r.reflection)
        );
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getIcon(icon: string): string {
    return this.iconMap[icon] || '🌱';
  }

  getHealthColor(score: number): string {
    if (score >= 75) return '#3d9a50';
    if (score >= 50) return '#f2b82b';
    return '#e15f87';
  }

  getMoodEmoji(mood: string): string {
    return this.moodEmojis[mood.toLowerCase()] || '😐';
  }

  getMoodGradient(mood: string): string {
    return this.moodGradients[mood.toLowerCase()] || 'linear-gradient(135deg, #FF9800, #FFB74D)';
  }

  getHealthLabel(score: number): string {
    if (score >= 75) return 'Thriving';
    if (score >= 50) return 'Growing';
    return 'Needs care';
  }

  getTotalStreak(): number {
    return this.practices().reduce((sum, p) => sum + p.currentStreak, 0);
  }

  getCategoryEmoji(category: string): string {
    return this.categoryEmojis[category.toLowerCase()] || '💪';
  }

  getCategoryGradient(category: string): string {
    return this.categoryGradients[category.toLowerCase()] || 'linear-gradient(135deg, #FF9800, #FFB74D)';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  logPractice(practice: Practice): void {
    this.api.logPractice(practice.id, {}).subscribe({
      next: () => {
        const updated = this.practices().map((p) =>
          p.id === practice.id
            ? { ...p, currentStreak: p.currentStreak + 1 }
            : p
        );
        this.practices.set(updated);
      },
    });
  }
}
