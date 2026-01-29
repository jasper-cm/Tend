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
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-soil">Reflections</h2>
          <p class="text-bark">
            Journal entries and reflections on your growth across life areas.
          </p>
        </div>
        <button
          (click)="toggleNewReflection()"
          class="px-4 py-2 bg-leaf text-white rounded-lg hover:bg-leaf-dark transition-colors text-sm font-medium"
        >
          {{ showNewReflection() ? 'Cancel' : 'New Reflection' }}
        </button>
      </div>

      <!-- New Reflection Form -->
      @if (showNewReflection()) {
        <div class="bg-parchment rounded-lg p-6 border border-sage/30">
          <h3 class="text-lg font-semibold text-soil mb-4">Write a Reflection</h3>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-soil mb-1">Title</label>
              <input
                type="text"
                [(ngModel)]="newReflection.title"
                class="w-full px-3 py-2 border border-sage/30 rounded-lg focus:outline-none focus:border-leaf"
                placeholder="What's on your mind?"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-soil mb-1">How are you feeling?</label>
              <div class="flex gap-2">
                @for (mood of moods; track mood.value) {
                  <button
                    (click)="newReflection.mood = mood.value"
                    [class.ring-2]="newReflection.mood === mood.value"
                    [class.ring-leaf]="newReflection.mood === mood.value"
                    class="p-2 rounded-lg bg-cream hover:bg-sage/20 transition-colors text-2xl"
                    [title]="mood.label"
                  >
                    {{ mood.emoji }}
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-soil mb-1">Your Reflection</label>
              <textarea
                [(ngModel)]="newReflection.content"
                rows="5"
                class="w-full px-3 py-2 border border-sage/30 rounded-lg focus:outline-none focus:border-leaf resize-none"
                placeholder="Write your thoughts, observations, and insights..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-soil mb-1">Related Life Areas</label>
              <div class="flex flex-wrap gap-2">
                @for (area of lifeAreas(); track area.id) {
                  <button
                    (click)="toggleLifeArea(area.id)"
                    [class.bg-leaf]="selectedLifeAreas().includes(area.id)"
                    [class.text-white]="selectedLifeAreas().includes(area.id)"
                    [class.bg-cream]="!selectedLifeAreas().includes(area.id)"
                    class="px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {{ area.name }}
                  </button>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-soil mb-1">Gratitude (optional)</label>
              <input
                type="text"
                [(ngModel)]="gratitudeInput"
                (keyup.enter)="addGratitude()"
                class="w-full px-3 py-2 border border-sage/30 rounded-lg focus:outline-none focus:border-leaf"
                placeholder="What are you grateful for? Press Enter to add"
              />
              @if (newReflection.gratitude.length > 0) {
                <div class="flex flex-wrap gap-2 mt-2">
                  @for (item of newReflection.gratitude; track $index) {
                    <span class="px-2 py-1 bg-sun/20 text-soil rounded-full text-sm flex items-center gap-1">
                      {{ item }}
                      <button (click)="removeGratitude($index)" class="text-bark hover:text-soil">&times;</button>
                    </span>
                  }
                </div>
              }
            </div>

            <button
              (click)="saveReflection()"
              [disabled]="!newReflection.title || !newReflection.content"
              class="w-full py-2 bg-leaf text-white rounded-lg hover:bg-leaf-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Reflection
            </button>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-pulse text-sage">Loading reflections...</div>
        </div>
      } @else {
        @if (reflections().length === 0 && !showNewReflection()) {
          <div class="bg-parchment rounded-lg p-8 text-center border border-sage/20">
            <div class="text-4xl mb-4">📝</div>
            <h3 class="text-lg font-medium text-soil mb-2">No reflections yet</h3>
            <p class="text-bark mb-4">Start journaling to track your growth and insights.</p>
            <button
              (click)="toggleNewReflection()"
              class="px-4 py-2 bg-leaf text-white rounded-lg hover:bg-leaf-dark transition-colors text-sm font-medium"
            >
              Write Your First Reflection
            </button>
          </div>
        } @else {
          <div class="space-y-4">
            @for (reflection of reflections(); track reflection.id) {
              <div class="bg-parchment rounded-lg p-5 border border-sage/20 hover:border-sage/40 transition-colors">
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="font-semibold text-soil text-lg">{{ reflection.title }}</h3>
                    <div class="text-xs text-bark-light mt-1">
                      {{ formatDate(reflection.createdAt) }}
                    </div>
                  </div>
                  @if (reflection.mood) {
                    <span class="text-3xl">{{ getMoodEmoji(reflection.mood) }}</span>
                  }
                </div>

                <p class="text-bark whitespace-pre-line">{{ reflection.content }}</p>

                @if (reflection.gratitude && reflection.gratitude.length > 0) {
                  <div class="mt-4">
                    <div class="text-sm font-medium text-soil mb-2">Gratitude:</div>
                    <div class="flex flex-wrap gap-2">
                      @for (item of reflection.gratitude; track $index) {
                        <span class="px-2 py-1 bg-sun/20 text-soil rounded-full text-sm">{{ item }}</span>
                      }
                    </div>
                  </div>
                }

                @if (reflection.lifeAreas && reflection.lifeAreas.length > 0) {
                  <div class="mt-4 flex flex-wrap gap-2">
                    @for (la of reflection.lifeAreas; track la.lifeArea.id) {
                      <a
                        [routerLink]="['/life-areas', la.lifeArea.id]"
                        class="px-2 py-1 bg-sage/20 text-leaf rounded-full text-xs hover:bg-sage/30 transition-colors"
                      >
                        {{ la.lifeArea.name }}
                      </a>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      }
    </div>
  `,
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
