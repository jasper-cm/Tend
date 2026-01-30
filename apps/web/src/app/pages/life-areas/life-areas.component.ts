import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, LifeArea } from '../../services/api.service';

@Component({
  selector: 'tend-life-areas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Hero Section -->
      <div class="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg">
        <!-- Decorative elements -->
        <div class="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-lg"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl lg:text-4xl font-bold mb-2">Life Areas</h1>
              <p class="text-white/90 max-w-lg">
                The dimensions of your life you are tending. Each one is a plot in your personal garden.
              </p>
            </div>
            <div class="hidden md:block">
              <div class="text-5xl">🌱</div>
            </div>
          </div>

          <!-- Stats Row -->
          @if (lifeAreas().length > 0) {
            <div class="flex gap-8 mt-6">
              <div>
                <span class="text-3xl font-bold">{{ lifeAreas().length }}</span>
                <span class="text-white/70 text-sm block">Life Areas</span>
              </div>
              <div>
                <span class="text-3xl font-bold">{{ thrivingCount() }}</span>
                <span class="text-white/70 text-sm block">Thriving</span>
              </div>
              <div>
                <span class="text-3xl font-bold">{{ averageHealth() }}%</span>
                <span class="text-white/70 text-sm block">Avg Health</span>
              </div>
            </div>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-16">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse mb-4">
            <span class="text-3xl">🌱</span>
          </div>
          <p class="text-gray-500">Loading life areas...</p>
        </div>
      } @else {
        @if (lifeAreas().length === 0) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-4xl">🌱</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No life areas yet</h3>
            <p class="text-gray-500 mb-6 max-w-md mx-auto">
              Start building your garden by adding life areas to tend. Each area represents a dimension of your life.
            </p>
            <button class="inline-flex items-center gap-2 px-6 py-3 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors font-medium">
              <span>Add Your First Life Area</span>
              <span>&rarr;</span>
            </button>
          </div>
        } @else {
          <!-- Stats Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">🌿</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Total</span>
              </div>
              <div class="text-3xl font-bold text-green-600">{{ lifeAreas().length }}</div>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">✨</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Thriving</span>
              </div>
              <div class="text-3xl font-bold text-emerald-600">{{ thrivingCount() }}</div>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">📈</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Growing</span>
              </div>
              <div class="text-3xl font-bold text-amber-500">{{ growingCount() }}</div>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">💧</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Needs Care</span>
              </div>
              <div class="text-3xl font-bold text-rose-500">{{ needsAttentionCount() }}</div>
            </div>
          </div>

          <!-- Life Areas Grid -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800">All Life Areas</h2>
              <p class="text-sm text-gray-500">Click on an area to see details and practices</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              @for (area of lifeAreas(); track area.id) {
                <a
                  [routerLink]="['/life-areas', area.id]"
                  class="p-5 hover:bg-gray-50 transition-colors group"
                >
                  <div class="flex items-start gap-4">
                    <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                         [style.background]="getHealthGradient(area.healthScore)">
                      {{ getIcon(area.icon) }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="font-semibold text-gray-800 group-hover:text-spirit-600 transition-colors">
                        {{ area.name }}
                      </h3>
                      <p class="text-gray-500 text-sm line-clamp-2 mt-1">{{ area.description }}</p>

                      <!-- Health Bar -->
                      <div class="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all duration-500"
                          [style.width.%]="area.healthScore"
                          [style.backgroundColor]="getHealthColor(area.healthScore)"
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
    if (score >= 75) return '#3d9a50'; // spirit-500
    if (score >= 50) return '#f2b82b'; // golden-400
    return '#e15f87'; // bloom-500
  }

  getHealthLabel(score: number): string {
    if (score >= 75) return 'Thriving';
    if (score >= 50) return 'Growing';
    return 'Needs care';
  }

  getHealthGradient(score: number): string {
    if (score >= 75) return 'linear-gradient(135deg, #4CAF50, #8BC34A)';
    if (score >= 50) return 'linear-gradient(135deg, #FF9800, #FFB74D)';
    return 'linear-gradient(135deg, #f44336, #E57373)';
  }
}
