import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, LifeArea } from '../../services/api.service';

@Component({
  selector: 'tend-life-areas',
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
              <h1 class="text-3xl lg:text-4xl font-semibold text-gray-800 mb-3 tracking-tight">Life Areas</h1>
              <p class="text-gray-600 max-w-lg leading-relaxed">
                The sacred dimensions of your life you are tending. Each one is a plot in your personal garden of growth.
              </p>
            </div>
            <div class="hidden md:block">
              <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200/30">
                <span class="text-4xl">🌱</span>
              </div>
            </div>
          </div>

          <!-- Stats Row -->
          @if (lifeAreas().length > 0) {
            <div class="flex gap-10 mt-8 pt-6 border-t border-green-100/50">
              <div class="text-center">
                <span class="text-3xl font-semibold text-gray-800">{{ lifeAreas().length }}</span>
                <span class="text-green-600/70 text-sm block mt-1">Life Areas</span>
              </div>
              <div class="text-center">
                <span class="text-3xl font-semibold text-green-600">{{ thrivingCount() }}</span>
                <span class="text-green-600/70 text-sm block mt-1">Thriving</span>
              </div>
              <div class="text-center">
                <span class="text-3xl font-semibold text-gray-800">{{ averageHealth() }}%</span>
                <span class="text-green-600/70 text-sm block mt-1">Avg Health</span>
              </div>
            </div>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-20">
          <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100/50 animate-breathe">
            <span class="text-4xl">🌱</span>
          </div>
          <p class="text-green-600/70 text-lg">Loading life areas...</p>
          <div class="flex gap-1.5 mt-4">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      } @else {
        @if (lifeAreas().length === 0) {
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 p-12 text-center shadow-lg shadow-green-100/10">
            <div class="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200/30 animate-breathe">
              <span class="text-5xl">🌱</span>
            </div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-3">Begin Your Journey</h3>
            <p class="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Start building your garden by adding life areas to tend. Each area represents a sacred dimension of your life.
            </p>
            <button class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg shadow-green-200/50 hover:shadow-xl hover:-translate-y-0.5">
              <span>Plant Your First Seed</span>
              <span>→</span>
            </button>
          </div>
        } @else {
          <!-- Stats Cards - Zen Style -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center">
                  <span class="text-xl">🌿</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Total</span>
              </div>
              <div class="text-3xl font-semibold text-gray-800">{{ lifeAreas().length }}</div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-gradient-to-br from-green-200/70 to-emerald-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">✨</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Thriving</span>
              </div>
              <div class="text-3xl font-semibold text-green-600">{{ thrivingCount() }}</div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-gradient-to-br from-amber-100/70 to-yellow-50 rounded-xl flex items-center justify-center">
                  <span class="text-xl">🌻</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Growing</span>
              </div>
              <div class="text-3xl font-semibold text-amber-600">{{ growingCount() }}</div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-gradient-to-br from-rose-100/70 to-pink-50 rounded-xl flex items-center justify-center">
                  <span class="text-xl">💧</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Needs Care</span>
              </div>
              <div class="text-3xl font-semibold text-rose-500">{{ needsAttentionCount() }}</div>
            </div>
          </div>

          <!-- Life Areas Grid - Zen Style -->
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 overflow-hidden shadow-lg shadow-green-100/10">
            <div class="px-8 py-5 border-b border-green-50">
              <h2 class="text-lg font-semibold text-gray-800">All Life Areas</h2>
              <p class="text-sm text-green-600/60">Click on an area to see details and practices</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              @for (area of lifeAreas(); track area.id) {
                <a
                  [routerLink]="['/life-areas', area.id]"
                  class="p-6 hover:bg-green-50/50 transition-all duration-300 border-b border-r border-green-50 group"
                >
                  <div class="flex items-start gap-4">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105"
                         [style.background]="getHealthGradient(area.healthScore)">
                      {{ getIcon(area.icon) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                        {{ area.name }}
                      </h3>
                      <p class="text-gray-500 text-sm line-clamp-2 mt-1">{{ area.description }}</p>

                      <!-- Health Bar -->
                      <div class="mt-3 h-2 bg-green-100/50 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-700 ease-out"
                          [style.width.%]="area.healthScore"
                          [style.background]="'linear-gradient(90deg, ' + getHealthColor(area.healthScore) + ', ' + getHealthColorLight(area.healthScore) + ')'"
                        ></div>
                      </div>

                      <div class="flex items-center justify-between mt-2 text-xs">
                        <span class="text-gray-500">{{ getHealthLabel(area.healthScore) }}</span>
                        <span class="font-semibold" [style.color]="getHealthColor(area.healthScore)">{{ area.healthScore }}%</span>
                      </div>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class LifeAreasComponent implements OnInit {
  private api = inject(ApiService);

  lifeAreas = signal<LifeArea[]>([]);
  loading = signal(true);
  averageHealth = signal(0);
  thrivingCount = signal(0);
  growingCount = signal(0);
  needsAttentionCount = signal(0);

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

  ngOnInit(): void {
    this.loadLifeAreas();
  }

  private loadLifeAreas(): void {
    this.api.getLifeAreas().subscribe({
      next: (areas) => {
        this.lifeAreas.set(areas);

        if (areas.length > 0) {
          const avg = Math.round(
            areas.reduce((sum, a) => sum + a.healthScore, 0) / areas.length
          );
          this.averageHealth.set(avg);
        }

        this.thrivingCount.set(areas.filter(a => a.healthScore >= 75).length);
        this.growingCount.set(areas.filter(a => a.healthScore >= 50 && a.healthScore < 75).length);
        this.needsAttentionCount.set(areas.filter(a => a.healthScore < 50).length);

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
    if (score >= 75) return '#22c55e'; // green-500
    if (score >= 50) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  }

  getHealthColorLight(score: number): string {
    if (score >= 75) return '#86efac'; // green-300
    if (score >= 50) return '#fcd34d'; // amber-300
    return '#fda4af'; // rose-300
  }

  getHealthLabel(score: number): string {
    if (score >= 75) return 'Thriving';
    if (score >= 50) return 'Growing';
    return 'Needs care';
  }

  getHealthGradient(score: number): string {
    if (score >= 75) return 'linear-gradient(135deg, #bbf7d0, #dcfce7)'; // soft green
    if (score >= 50) return 'linear-gradient(135deg, #fde68a, #fef3c7)'; // soft amber
    return 'linear-gradient(135deg, #fecdd3, #ffe4e6)'; // soft rose
  }
}
