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
        <div class="flex items-center justify-center py-12">
          <div class="animate-pulse text-sage">Loading life area...</div>
        </div>
      } @else if (lifeArea()) {
        <div class="flex items-start justify-between">
          <div>
            <a routerLink="/life-areas" class="text-sage hover:text-leaf text-sm mb-2 inline-block">&larr; Back to Life Areas</a>
            <h2 class="text-2xl font-bold text-soil flex items-center gap-3">
              <span class="text-3xl">{{ getIcon(lifeArea()!.icon) }}</span>
              {{ lifeArea()!.name }}
            </h2>
            <p class="text-bark mt-1">{{ lifeArea()!.description }}</p>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold" [style.color]="getHealthColor(lifeArea()!.healthScore)">
              {{ lifeArea()!.healthScore }}
            </div>
            <div class="text-sm text-bark">Health Score</div>
          </div>
        </div>

        <!-- Health Bar -->
        <div class="bg-parchment rounded-full h-3 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            [style.width.%]="lifeArea()!.healthScore"
            [style.backgroundColor]="getHealthColor(lifeArea()!.healthScore)"
          ></div>
        </div>

        <!-- Practices Section -->
        <div class="mt-8">
          <h3 class="text-xl font-semibold text-soil mb-4">Practices</h3>
          @if (practices().length === 0) {
            <div class="bg-parchment rounded-lg p-6 text-center">
              <p class="text-bark">No practices yet for this life area.</p>
              <p class="text-bark-light text-sm mt-2">Add practices to start nurturing this part of your garden.</p>
            </div>
          } @else {
            <div class="grid gap-4">
              @for (practice of practices(); track practice.id) {
                <div class="bg-parchment rounded-lg p-4 border border-sage/20 hover:border-sage/40 transition-colors">
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 class="font-medium text-soil">{{ practice.name }}</h4>
                      <p class="text-bark text-sm mt-1">{{ practice.description }}</p>
                      <div class="flex gap-3 mt-2 text-xs">
                        <span class="px-2 py-1 bg-sage/20 rounded text-leaf">{{ practice.category }}</span>
                        <span class="px-2 py-1 bg-sun/20 rounded text-soil">{{ practice.frequency }}</span>
                      </div>
                    </div>
                    <div class="text-right">
                      @if (practice.currentStreak > 0) {
                        <div class="text-2xl font-bold text-leaf">{{ practice.currentStreak }}</div>
                        <div class="text-xs text-bark">day streak</div>
                      } @else {
                        <div class="text-sm text-bark-light">No streak</div>
                      }
                    </div>
                  </div>
                  <button
                    (click)="logPractice(practice)"
                    class="mt-3 w-full py-2 bg-leaf text-white rounded hover:bg-leaf-dark transition-colors text-sm font-medium"
                  >
                    Log Completion
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Recent Reflections Section -->
        <div class="mt-8">
          <h3 class="text-xl font-semibold text-soil mb-4">Recent Reflections</h3>
          @if (reflections().length === 0) {
            <div class="bg-parchment rounded-lg p-6 text-center">
              <p class="text-bark">No reflections tagged with this life area yet.</p>
              <a routerLink="/reflections" class="text-leaf hover:text-leaf-dark text-sm mt-2 inline-block">
                Write a reflection &rarr;
              </a>
            </div>
          } @else {
            <div class="space-y-3">
              @for (ref of reflections(); track ref.id) {
                <div class="bg-parchment rounded-lg p-4 border border-sage/20">
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 class="font-medium text-soil">{{ ref.title }}</h4>
                      <p class="text-bark text-sm mt-1 line-clamp-2">{{ ref.content }}</p>
                    </div>
                    @if (ref.mood) {
                      <span class="text-2xl">{{ getMoodEmoji(ref.mood) }}</span>
                    }
                  </div>
                  <div class="text-xs text-bark-light mt-2">
                    {{ formatDate(ref.createdAt) }}
                  </div>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <p class="text-bark">Life area not found.</p>
          <a routerLink="/life-areas" class="text-leaf hover:text-leaf-dark mt-2 inline-block">
            &larr; Back to Life Areas
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
    if (score >= 75) return '#4a7c59';
    if (score >= 50) return '#d4a843';
    return '#c07850';
  }

  getMoodEmoji(mood: string): string {
    return this.moodEmojis[mood.toLowerCase()] || '😐';
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
