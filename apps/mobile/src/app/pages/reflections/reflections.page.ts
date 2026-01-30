import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonButton,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonChip,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonAvatar,
  IonBadge,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  closeOutline,
  happyOutline,
  sadOutline,
  bookOutline,
  calendarOutline,
  heartOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { ApiService, Reflection, LifeArea } from '../../services/api.service';

@Component({
  selector: 'tend-reflections-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonButton,
    IonButtons,
    IonRefresher,
    IonRefresherContent,
    IonChip,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonAvatar,
    IonBadge,
    IonNote,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="book-outline" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
          Reflections
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openNewReflection()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px;">
          <ion-spinner name="crescent" color="primary" style="width: 48px; height: 48px;"></ion-spinner>
          <p style="margin-top: 16px; color: var(--ion-color-medium);">Loading reflections...</p>
        </div>
      } @else {
        <!-- Stats Card -->
        @if (reflections().length > 0) {
          <ion-card color="secondary">
            <ion-card-header>
              <ion-card-subtitle>Your Journey</ion-card-subtitle>
              <ion-card-title style="font-size: 20px;">
                <ion-icon name="sparkles-outline" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
                Reflection Stats
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                <div>
                  <div style="font-size: 32px; font-weight: bold;">{{ reflections().length }}</div>
                  <div style="font-size: 11px; opacity: 0.8;">Total Entries</div>
                </div>
                <div>
                  <div style="font-size: 32px; font-weight: bold;">{{ currentStreak() }}</div>
                  <div style="font-size: 11px; opacity: 0.8;">Day Streak</div>
                </div>
                <div>
                  <div style="font-size: 32px; font-weight: bold;">{{ getMostCommonMood() }}</div>
                  <div style="font-size: 11px; opacity: 0.8;">Top Mood</div>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        }

        @if (reflections().length === 0) {
          <ion-card>
            <ion-card-content style="text-align: center; padding: 40px 20px;">
              <div style="font-size: 64px; margin-bottom: 16px;">📝</div>
              <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0; color: var(--ion-color-dark);">
                No Reflections Yet
              </h2>
              <p style="color: var(--ion-color-medium); margin: 0 0 24px 0;">
                Start journaling to track your growth, celebrate wins,<br>
                and gain insights about your life garden.
              </p>
              <ion-button expand="block" color="primary" size="large" (click)="openNewReflection()">
                <ion-icon name="add-outline" slot="start"></ion-icon>
                Write Your First Reflection
              </ion-button>
            </ion-card-content>
          </ion-card>

          <!-- Writing Prompts -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>Writing Prompts</ion-card-title>
              <ion-card-subtitle>Get inspired to start journaling</ion-card-subtitle>
            </ion-card-header>
            <ion-list>
              @for (prompt of writingPrompts; track prompt.title) {
                <ion-item button (click)="startWithPrompt(prompt.starter)">
                  <ion-avatar slot="start" [style.background]="prompt.gradient">
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                      {{ prompt.emoji }}
                    </div>
                  </ion-avatar>
                  <ion-label>
                    <h2 style="font-weight: 600;">{{ prompt.title }}</h2>
                    <p>{{ prompt.starter }}</p>
                  </ion-label>
                  <ion-icon name="add-outline" slot="end" color="primary"></ion-icon>
                </ion-item>
              }
            </ion-list>
          </ion-card>
        } @else {
          <!-- Reflections List -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>Your Reflections</ion-card-title>
              <ion-card-subtitle>{{ reflections().length }} entries in your journal</ion-card-subtitle>
            </ion-card-header>
            <ion-list>
              @for (reflection of reflections(); track reflection.id) {
                <ion-item button detail="true">
                  <ion-avatar slot="start" [style.background]="getMoodGradient(reflection.mood)">
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                      {{ getMoodEmoji(reflection.mood) }}
                    </div>
                  </ion-avatar>
                  <ion-label>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <h2 style="font-weight: 600; margin: 0;">{{ reflection.title }}</h2>
                    </div>
                    <p style="font-size: 12px; color: var(--ion-color-medium); margin: 4px 0 8px 0;">
                      <ion-icon name="calendar-outline" style="font-size: 12px; margin-right: 4px; vertical-align: middle;"></ion-icon>
                      {{ formatDate(reflection.createdAt) }}
                    </p>
                    <p style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0 0 8px 0;">
                      {{ reflection.content }}
                    </p>
                    @if (reflection.gratitude && reflection.gratitude.length > 0) {
                      <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
                        <ion-icon name="heart-outline" color="danger" style="font-size: 14px;"></ion-icon>
                        <span style="font-size: 12px; color: var(--ion-color-medium);">
                          {{ reflection.gratitude.length }} gratitude{{ reflection.gratitude.length > 1 ? 's' : '' }}
                        </span>
                      </div>
                    }
                    @if (reflection.lifeAreas && reflection.lifeAreas.length > 0) {
                      <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        @for (la of reflection.lifeAreas.slice(0, 3); track la.lifeArea.id) {
                          <ion-chip size="small" color="tertiary">{{ la.lifeArea.name }}</ion-chip>
                        }
                        @if (reflection.lifeAreas.length > 3) {
                          <ion-chip size="small" color="medium">+{{ reflection.lifeAreas.length - 3 }}</ion-chip>
                        }
                      </div>
                    }
                  </ion-label>
                </ion-item>
              }
            </ion-list>
          </ion-card>
        }
      }

      <!-- New Reflection Modal -->
      <ion-modal [isOpen]="showNewReflection()" (didDismiss)="closeNewReflection()">
        <ng-template>
          <ion-header>
            <ion-toolbar color="primary">
              <ion-buttons slot="start">
                <ion-button (click)="closeNewReflection()">
                  <ion-icon slot="icon-only" name="close-outline"></ion-icon>
                </ion-button>
              </ion-buttons>
              <ion-title>New Reflection</ion-title>
              <ion-buttons slot="end">
                <ion-button
                  (click)="saveReflection()"
                  [disabled]="!newReflection.title || !newReflection.content"
                  strong="true"
                >
                  Save
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="ion-padding">
            <ion-card>
              <ion-card-content>
                <ion-list lines="none">
                  <ion-item>
                    <ion-input
                      label="Title"
                      labelPlacement="stacked"
                      [(ngModel)]="newReflection.title"
                      placeholder="What's on your mind?"
                      style="font-size: 18px; font-weight: 600;"
                    ></ion-input>
                  </ion-item>

                  <ion-item style="margin-top: 16px;">
                    <ion-label position="stacked" style="margin-bottom: 12px;">How are you feeling?</ion-label>
                    <div style="display: flex; gap: 8px; padding: 8px 0; flex-wrap: wrap;">
                      @for (mood of moods; track mood.value) {
                        <button
                          type="button"
                          (click)="newReflection.mood = mood.value"
                          [style.width.px]="52"
                          [style.height.px]="52"
                          [style.border-radius.%]="50"
                          [style.border]="newReflection.mood === mood.value ? '3px solid var(--ion-color-primary)' : '2px solid var(--ion-color-light)'"
                          [style.background]="newReflection.mood === mood.value ? 'var(--ion-color-primary-tint)' : 'var(--ion-color-light)'"
                          [style.font-size.px]="24"
                          [style.cursor]="'pointer'"
                          [style.transition]="'all 0.2s'"
                          [style.transform]="newReflection.mood === mood.value ? 'scale(1.1)' : 'scale(1)'"
                        >
                          {{ mood.emoji }}
                        </button>
                      }
                    </div>
                  </ion-item>

                  <ion-item style="margin-top: 16px;">
                    <ion-textarea
                      label="Your Reflection"
                      labelPlacement="stacked"
                      [(ngModel)]="newReflection.content"
                      placeholder="Write your thoughts, observations, and insights..."
                      [rows]="8"
                      [autoGrow]="true"
                    ></ion-textarea>
                  </ion-item>

                  <ion-item style="margin-top: 16px;">
                    <ion-select
                      label="Related Life Areas"
                      labelPlacement="stacked"
                      [(ngModel)]="selectedLifeAreas"
                      [multiple]="true"
                      placeholder="Select life areas (optional)"
                    >
                      @for (area of lifeAreas(); track area.id) {
                        <ion-select-option [value]="area.id">{{ area.name }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>

            <!-- Gratitude Section -->
            <ion-card>
              <ion-card-header>
                <ion-card-title style="font-size: 18px;">
                  <ion-icon name="heart-outline" color="danger" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
                  Gratitude
                </ion-card-title>
                <ion-card-subtitle>What are you thankful for today?</ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                <ion-item lines="none">
                  <ion-input
                    [(ngModel)]="gratitudeInput"
                    (keyup.enter)="addGratitude()"
                    placeholder="Type and press Enter to add"
                  ></ion-input>
                  <ion-button slot="end" fill="clear" (click)="addGratitude()" [disabled]="!gratitudeInput.trim()">
                    <ion-icon slot="icon-only" name="add-outline"></ion-icon>
                  </ion-button>
                </ion-item>

                @if (newReflection.gratitude.length > 0) {
                  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px;">
                    @for (item of newReflection.gratitude; track $index) {
                      <ion-chip color="warning">
                        {{ item }}
                        <ion-icon name="close-outline" (click)="removeGratitude($index)"></ion-icon>
                      </ion-chip>
                    }
                  </div>
                }
              </ion-card-content>
            </ion-card>
          </ion-content>
        </ng-template>
      </ion-modal>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button (click)="openNewReflection()" color="primary">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class ReflectionsPage implements OnInit {
  private api = inject(ApiService);

  reflections = signal<Reflection[]>([]);
  lifeAreas = signal<LifeArea[]>([]);
  loading = signal(true);
  showNewReflection = signal(false);
  currentStreak = signal(0);
  selectedLifeAreas: string[] = [];

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
    { title: 'Gratitude', emoji: '🙏', starter: 'Today I am grateful for...', gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
    { title: 'Achievement', emoji: '🏆', starter: 'Something I accomplished recently...', gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)' },
    { title: 'Learning', emoji: '💡', starter: 'A lesson I learned today...', gradient: 'linear-gradient(135deg, #2196F3, #03A9F4)' },
    { title: 'Challenge', emoji: '💪', starter: 'A challenge I\'m facing and how I plan to overcome it...', gradient: 'linear-gradient(135deg, #E91E63, #F48FB1)' },
  ];

  private moodEmojis: Record<string, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    neutral: '😐',
    low: '😔',
    difficult: '😢',
  };

  constructor() {
    addIcons({
      addOutline,
      closeOutline,
      happyOutline,
      sadOutline,
      bookOutline,
      calendarOutline,
      heartOutline,
      sparklesOutline,
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  handleRefresh(event: CustomEvent): void {
    this.loadData();
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  private loadData(): void {
    this.loading.set(true);
    this.api.getReflections().subscribe({
      next: (reflections) => {
        this.reflections.set(reflections);
        this.calculateStreak(reflections);
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

  private calculateStreak(reflections: Reflection[]): void {
    if (reflections.length === 0) {
      this.currentStreak.set(0);
      return;
    }

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sortedReflections = [...reflections].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    for (const reflection of sortedReflections) {
      const reflectionDate = new Date(reflection.createdAt);
      reflectionDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - streak);

      if (reflectionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else if (reflectionDate.getTime() < expectedDate.getTime()) {
        break;
      }
    }

    this.currentStreak.set(streak);
  }

  getMostCommonMood(): string {
    const moodCounts: Record<string, number> = {};
    for (const reflection of this.reflections()) {
      if (reflection.mood) {
        moodCounts[reflection.mood] = (moodCounts[reflection.mood] || 0) + 1;
      }
    }

    let maxCount = 0;
    let mostCommon = '😐';
    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = this.getMoodEmoji(mood);
      }
    }

    return mostCommon;
  }

  openNewReflection(): void {
    this.showNewReflection.set(true);
  }

  closeNewReflection(): void {
    this.showNewReflection.set(false);
    this.resetForm();
  }

  startWithPrompt(starter: string): void {
    this.newReflection.content = starter;
    this.openNewReflection();
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
      lifeAreaIds: this.selectedLifeAreas,
      userId: 'demo-user',
    }).subscribe({
      next: (reflection) => {
        this.reflections.set([reflection, ...this.reflections()]);
        this.closeNewReflection();
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
    this.selectedLifeAreas = [];
  }

  getMoodEmoji(mood: string | undefined): string {
    if (!mood) return '😐';
    return this.moodEmojis[mood.toLowerCase()] || '😐';
  }

  getMoodGradient(mood: string | undefined): string {
    switch (mood?.toLowerCase()) {
      case 'great':
        return 'linear-gradient(135deg, #4CAF50, #8BC34A)';
      case 'good':
        return 'linear-gradient(135deg, #8BC34A, #CDDC39)';
      case 'okay':
        return 'linear-gradient(135deg, #FFC107, #FFEB3B)';
      case 'low':
        return 'linear-gradient(135deg, #FF9800, #FFB74D)';
      case 'difficult':
        return 'linear-gradient(135deg, #f44336, #E57373)';
      default:
        return 'linear-gradient(135deg, #9E9E9E, #BDBDBD)';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
