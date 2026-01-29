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
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-soil">Life Areas</h2>
          <p class="text-bark">
            The areas of your life you are tending. Each one is a plot in your garden.
          </p>
        </div>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-pulse text-sage">Loading life areas...</div>
        </div>
      } @else {
        @if (lifeAreas().length === 0) {
          <div class="bg-parchment rounded-lg p-8 text-center border border-sage/20">
            <div class="text-4xl mb-4">🌱</div>
            <h3 class="text-lg font-medium text-soil mb-2">No life areas yet</h3>
            <p class="text-bark mb-4">Start building your garden by adding life areas to tend.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (area of lifeAreas(); track area.id) {
              <a
                [routerLink]="['/life-areas', area.id]"
                class="bg-parchment rounded-lg p-5 border border-sage/20 hover:border-sage/40 hover:shadow-md transition-all group"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">{{ getIcon(area.icon) }}</span>
                    <h3 class="font-semibold text-soil group-hover:text-leaf transition-colors">
                      {{ area.name }}
                    </h3>
                  </div>
                  <div
                    class="text-xl font-bold"
                    [style.color]="getHealthColor(area.healthScore)"
                  >
                    {{ area.healthScore }}
                  </div>
                </div>

                <p class="text-bark text-sm mb-4 line-clamp-2">{{ area.description }}</p>

                <!-- Health Bar -->
                <div class="bg-cream rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    [style.width.%]="area.healthScore"
                    [style.backgroundColor]="getHealthColor(area.healthScore)"
                  ></div>
                </div>

                <div class="flex items-center justify-between mt-3 text-xs text-bark">
                  <span>{{ getHealthLabel(area.healthScore) }}</span>
                  <span>{{ area.practices?.length || 0 }} practices</span>
                </div>
              </a>
            }
          </div>

          <!-- Summary Stats -->
          <div class="bg-parchment rounded-lg p-4 border border-sage/20">
            <div class="flex flex-wrap gap-6 justify-center text-center">
              <div>
                <div class="text-2xl font-bold text-soil">{{ lifeAreas().length }}</div>
                <div class="text-xs text-bark">Life Areas</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-leaf">{{ thrivingCount() }}</div>
                <div class="text-xs text-bark">Thriving</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-sun">{{ growingCount() }}</div>
                <div class="text-xs text-bark">Growing</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-terracotta">{{ needsAttentionCount() }}</div>
                <div class="text-xs text-bark">Needs Care</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-soil">{{ averageHealth() }}</div>
                <div class="text-xs text-bark">Avg Health</div>
              </div>
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
    if (score >= 75) return '#4a7c59';
    if (score >= 50) return '#d4a843';
    return '#c07850';
  }

  getHealthLabel(score: number): string {
    if (score >= 75) return 'Thriving';
    if (score >= 50) return 'Growing';
    return 'Needs care';
  }
}
