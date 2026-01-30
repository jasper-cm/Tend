import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonBadge,
  IonSpinner,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent,
  IonChip,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonAvatar,
  IonFab,
  IonFabButton,
  IonProgressBar,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  flameOutline,
  flame,
  checkmarkCircleOutline,
  pauseCircleOutline,
  trophyOutline,
  addOutline,
  timerOutline,
  calendarOutline,
  repeatOutline,
  leafOutline,
} from 'ionicons/icons';
import { ApiService, Practice } from '../../services/api.service';

@Component({
  selector: 'tend-practices-page',
  standalone: true,
  imports: [
    CommonModule,
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
    IonBadge,
    IonSpinner,
    IonButton,
    IonSegment,
    IonSegmentButton,
    IonRefresher,
    IonRefresherContent,
    IonChip,
    IonIcon,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonAvatar,
    IonFab,
    IonFabButton,
    IonProgressBar,
    IonNote,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <ion-icon name="leaf-outline" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
          Practices
        </ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment [value]="filter()" (ionChange)="filterBy($event)">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="active">
            <ion-label>Active</ion-label>
          </ion-segment-button>
          <ion-segment-button value="streaks">
            <ion-icon name="flame-outline"></ion-icon>
            <ion-label>Streaks</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px;">
          <ion-spinner name="crescent" color="primary" style="width: 48px; height: 48px;"></ion-spinner>
          <p style="margin-top: 16px; color: var(--ion-color-medium);">Loading practices...</p>
        </div>
      } @else {
        <!-- Streak Summary Card -->
        @if (practices().length > 0) {
          <ion-card color="tertiary">
            <ion-card-header>
              <ion-card-subtitle>Your Progress</ion-card-subtitle>
              <ion-card-title style="font-size: 20px;">
                <ion-icon name="flame" style="margin-right: 8px; vertical-align: middle; color: #FF9800;"></ion-icon>
                Streak Overview
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                <div>
                  <div style="font-size: 32px; font-weight: bold;">{{ totalStreakDays() }}</div>
                  <div style="font-size: 11px; opacity: 0.8;">Total Streak Days</div>
                </div>
                <div>
                  <div style="font-size: 32px; font-weight: bold;">{{ longestStreak() }}</div>
                  <div style="font-size: 11px; opacity: 0.8;">Longest Streak</div>
                </div>
                <div>
                  <div style="font-size: 32px; font-weight: bold;">{{ onStreakCount() }}</div>
                  <div style="font-size: 11px; opacity: 0.8;">Active Streaks</div>
                </div>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Quick Stats -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
            <ion-card style="margin: 0;">
              <ion-card-content style="text-align: center; padding: 16px;">
                <ion-icon name="checkmark-circle-outline" color="success" style="font-size: 28px;"></ion-icon>
                <div style="font-size: 24px; font-weight: bold; color: var(--ion-color-success); margin: 4px 0;">{{ activePracticesCount() }}</div>
                <div style="font-size: 12px; color: var(--ion-color-medium);">Active Practices</div>
              </ion-card-content>
            </ion-card>
            <ion-card style="margin: 0;">
              <ion-card-content style="text-align: center; padding: 16px;">
                <ion-icon name="pause-circle-outline" color="medium" style="font-size: 28px;"></ion-icon>
                <div style="font-size: 24px; font-weight: bold; color: var(--ion-color-medium); margin: 4px 0;">{{ pausedPracticesCount() }}</div>
                <div style="font-size: 12px; color: var(--ion-color-medium);">Paused</div>
              </ion-card-content>
            </ion-card>
          </div>
        }

        @if (filteredPractices().length === 0) {
          <ion-card>
            <ion-card-content style="text-align: center; padding: 40px 20px;">
              <div style="font-size: 64px; margin-bottom: 16px;">🌱</div>
              <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0; color: var(--ion-color-dark);">
                {{ filter() === 'all' ? 'No Practices Yet' : 'No Matching Practices' }}
              </h2>
              <p style="color: var(--ion-color-medium); margin: 0 0 24px 0;">
                {{ filter() === 'all' ? 'Add practices to start building healthy habits that nurture your life areas.' : 'Try a different filter to see your practices.' }}
              </p>
              @if (filter() === 'all') {
                <ion-button expand="block" color="primary" size="large">
                  <ion-icon name="add-outline" slot="start"></ion-icon>
                  Add Your First Practice
                </ion-button>
              }
            </ion-card-content>
          </ion-card>

          <!-- Suggested Practices -->
          @if (filter() === 'all') {
            <ion-card>
              <ion-card-header>
                <ion-card-title>Suggested Practices</ion-card-title>
                <ion-card-subtitle>Popular habits to get started</ion-card-subtitle>
              </ion-card-header>
              <ion-list>
                @for (suggestion of suggestedPractices; track suggestion.name) {
                  <ion-item button>
                    <ion-avatar slot="start" [style.background]="suggestion.gradient">
                      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        {{ suggestion.emoji }}
                      </div>
                    </ion-avatar>
                    <ion-label>
                      <h2 style="font-weight: 600;">{{ suggestion.name }}</h2>
                      <p>{{ suggestion.description }}</p>
                    </ion-label>
                    <ion-button slot="end" fill="clear" color="primary">
                      <ion-icon name="add-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                  </ion-item>
                }
              </ion-list>
            </ion-card>
          }
        } @else {
          <!-- Practices List -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>{{ getFilterTitle() }}</ion-card-title>
              <ion-card-subtitle>Swipe left to log a practice</ion-card-subtitle>
            </ion-card-header>
            <ion-list>
              @for (practice of filteredPractices(); track practice.id) {
                <ion-item-sliding>
                  <ion-item>
                    <ion-avatar slot="start" [style.background]="getPracticeGradient(practice)">
                      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        {{ getCategoryEmoji(practice.category) }}
                      </div>
                    </ion-avatar>
                    <ion-label>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="font-weight: 600; display: flex; align-items: center; gap: 8px;">
                          {{ practice.name }}
                          @if (!practice.isActive) {
                            <ion-badge color="medium" style="font-size: 10px;">Paused</ion-badge>
                          }
                        </h2>
                        @if (practice.currentStreak > 0) {
                          <div style="display: flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); color: white; padding: 4px 10px; border-radius: 16px; font-weight: bold;">
                            <ion-icon name="flame" style="font-size: 16px;"></ion-icon>
                            <span style="font-size: 16px;">{{ practice.currentStreak }}</span>
                          </div>
                        }
                      </div>
                      <p>{{ practice.description }}</p>
                      <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
                        @if (practice.lifeArea) {
                          <ion-chip size="small" color="tertiary">
                            {{ practice.lifeArea.name }}
                          </ion-chip>
                        }
                        <ion-chip size="small" outline>
                          <ion-icon name="repeat-outline" style="margin-right: 4px;"></ion-icon>
                          {{ practice.frequency }}
                        </ion-chip>
                        @if (practice.duration) {
                          <ion-chip size="small" outline>
                            <ion-icon name="timer-outline" style="margin-right: 4px;"></ion-icon>
                            {{ practice.duration }}m
                          </ion-chip>
                        }
                      </div>
                      @if (practice.longestStreak > practice.currentStreak && practice.longestStreak > 0) {
                        <div style="display: flex; align-items: center; gap: 4px; margin-top: 8px; font-size: 12px; color: var(--ion-color-medium);">
                          <ion-icon name="trophy-outline" style="font-size: 14px; color: var(--ion-color-warning);"></ion-icon>
                          Personal best: {{ practice.longestStreak }} days
                        </div>
                      }
                    </ion-label>
                  </ion-item>
                  <ion-item-options side="end">
                    <ion-item-option
                      color="success"
                      (click)="logPractice(practice)"
                      [disabled]="!practice.isActive"
                      style="width: 80px;"
                    >
                      <div style="display: flex; flex-direction: column; align-items: center;">
                        <ion-icon name="checkmark-circle-outline" style="font-size: 24px;"></ion-icon>
                        <span style="font-size: 11px; margin-top: 4px;">Log</span>
                      </div>
                    </ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
              }
            </ion-list>
          </ion-card>
        }
      }

      <!-- FAB for adding new practice -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button color="primary">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class PracticesPage implements OnInit {
  private api = inject(ApiService);

  practices = signal<Practice[]>([]);
  loading = signal(true);
  filter = signal<'all' | 'active' | 'streaks'>('all');

  totalStreakDays = signal(0);
  longestStreak = signal(0);
  onStreakCount = signal(0);
  activePracticesCount = signal(0);
  pausedPracticesCount = signal(0);

  suggestedPractices = [
    { name: 'Morning Meditation', emoji: '🧘', description: '10 minutes of mindful breathing', gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)' },
    { name: 'Daily Exercise', emoji: '💪', description: '30 minutes of physical activity', gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)' },
    { name: 'Journaling', emoji: '📝', description: 'Write your thoughts and reflections', gradient: 'linear-gradient(135deg, #2196F3, #03A9F4)' },
    { name: 'Reading', emoji: '📚', description: 'Read for 20 minutes', gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
    { name: 'Gratitude Practice', emoji: '🙏', description: 'List 3 things you\'re grateful for', gradient: 'linear-gradient(135deg, #E91E63, #F48FB1)' },
  ];

  private categoryEmojis: Record<string, string> = {
    habit: '🔄',
    routine: '📋',
    ritual: '✨',
    exercise: '💪',
    mindfulness: '🧘',
    learning: '📚',
    creative: '🎨',
    social: '👥',
    health: '❤️',
    default: '🌿',
  };

  constructor() {
    addIcons({
      flameOutline,
      flame,
      checkmarkCircleOutline,
      pauseCircleOutline,
      trophyOutline,
      addOutline,
      timerOutline,
      calendarOutline,
      repeatOutline,
      leafOutline,
    });
  }

  ngOnInit(): void {
    this.loadPractices();
  }

  handleRefresh(event: CustomEvent): void {
    this.loadPractices();
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  private loadPractices(): void {
    this.loading.set(true);
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
        this.activePracticesCount.set(practices.filter(p => p.isActive).length);
        this.pausedPracticesCount.set(practices.filter(p => !p.isActive).length);

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

  filterBy(event: CustomEvent): void {
    this.filter.set(event.detail.value as 'all' | 'active' | 'streaks');
  }

  getFilterTitle(): string {
    switch (this.filter()) {
      case 'active':
        return 'Active Practices';
      case 'streaks':
        return 'Practices on Streak';
      default:
        return 'All Practices';
    }
  }

  getPracticeGradient(practice: Practice): string {
    if (!practice.isActive) {
      return 'linear-gradient(135deg, #9E9E9E, #BDBDBD)';
    }
    if (practice.currentStreak >= 7) {
      return 'linear-gradient(135deg, #FF9800, #FF5722)';
    }
    if (practice.currentStreak > 0) {
      return 'linear-gradient(135deg, #4CAF50, #8BC34A)';
    }
    return 'linear-gradient(135deg, #2196F3, #03A9F4)';
  }

  getCategoryEmoji(category: string): string {
    return this.categoryEmojis[category.toLowerCase()] || this.categoryEmojis['default'];
  }

  logPractice(practice: Practice): void {
    if (!practice.isActive) return;

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
