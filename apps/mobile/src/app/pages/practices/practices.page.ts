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
  IonButtons,
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
  IonMenuButton,
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
    IonButtons,
    IonMenuButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button style="--color: white;"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          <ion-icon name="leaf-outline" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
          Practices
        </ion-title>
      </ion-toolbar>
      <ion-toolbar style="--background: rgba(255, 255, 255, 0.95); --border-color: rgba(134, 239, 172, 0.2);">
        <ion-segment [value]="filter()" (ionChange)="filterBy($event)" style="--background: rgba(240, 253, 244, 0.8); padding: 4px; border-radius: 16px; margin: 8px 16px;">
          <ion-segment-button value="all" style="--background-checked: white; --indicator-color: white; --color: #6b7280; --color-checked: #22c55e; --border-radius: 12px; font-weight: 500; min-height: 36px;">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="active" style="--background-checked: white; --indicator-color: white; --color: #6b7280; --color-checked: #22c55e; --border-radius: 12px; font-weight: 500; min-height: 36px;">
            <ion-label>Active</ion-label>
          </ion-segment-button>
          <ion-segment-button value="streaks" style="--background-checked: white; --indicator-color: white; --color: #6b7280; --color-checked: #22c55e; --border-radius: 12px; font-weight: 500; min-height: 36px;">
            <ion-icon name="flame-outline" style="font-size: 16px; margin-right: 4px;"></ion-icon>
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
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2);">
            <span style="font-size: 40px;">🧘</span>
          </div>
          <p style="margin-top: 20px; color: #22c55e; font-weight: 500;">Loading practices...</p>
        </div>
      } @else {
        <!-- Streak Summary Card - Zen Style -->
        @if (practices().length > 0) {
          <ion-card style="--background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%); border-radius: 24px; box-shadow: 0 8px 32px rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.2); position: relative; overflow: hidden; margin-bottom: 20px;">
            <div style="position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%); pointer-events: none;"></div>
            <ion-card-header style="padding-bottom: 8px;">
              <ion-card-subtitle style="color: #b45309; font-weight: 500;">Your Progress</ion-card-subtitle>
              <ion-card-title style="font-size: 22px; color: #78350f; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 24px;">🔥</span>
                Streak Overview
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                <div>
                  <div style="font-size: 32px; font-weight: 700; color: #78350f;">{{ totalStreakDays() }}</div>
                  <div style="font-size: 11px; color: #b45309; font-weight: 500;">Total Streak Days</div>
                </div>
                <div>
                  <div style="font-size: 32px; font-weight: 700; color: #78350f;">{{ longestStreak() }}</div>
                  <div style="font-size: 11px; color: #b45309; font-weight: 500;">Longest Streak</div>
                </div>
                <div>
                  <div style="font-size: 32px; font-weight: 700; color: #78350f;">{{ onStreakCount() }}</div>
                  <div style="font-size: 11px; color: #b45309; font-weight: 500;">Active Streaks</div>
                </div>
              </div>
            </ion-card-content>
          </ion-card>

          <!-- Quick Stats - Zen Style -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
            <ion-card style="margin: 0; --background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 20px rgba(34, 197, 94, 0.08);">
              <ion-card-content style="text-align: center; padding: 20px 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                  <span style="font-size: 22px;">✅</span>
                </div>
                <div style="font-size: 28px; font-weight: 700; color: #22c55e;">{{ activePracticesCount() }}</div>
                <div style="font-size: 12px; color: #6b7280; font-weight: 500;">Active Practices</div>
              </ion-card-content>
            </ion-card>
            <ion-card style="margin: 0; --background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 20px rgba(34, 197, 94, 0.08);">
              <ion-card-content style="text-align: center; padding: 20px 16px;">
                <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f3f4f6, #e5e7eb); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                  <span style="font-size: 22px;">⏸️</span>
                </div>
                <div style="font-size: 28px; font-weight: 700; color: #6b7280;">{{ pausedPracticesCount() }}</div>
                <div style="font-size: 12px; color: #6b7280; font-weight: 500;">Paused</div>
              </ion-card-content>
            </ion-card>
          </div>
        }

        @if (filteredPractices().length === 0) {
          <!-- Empty State - Zen Style -->
          <ion-card style="--background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1);">
            <ion-card-content style="text-align: center; padding: 48px 24px;">
              <div style="width: 96px; height: 96px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2);">
                <span style="font-size: 48px;">🧘</span>
              </div>
              <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 12px 0; color: #1f2937;">
                {{ filter() === 'all' ? 'No Practices Yet' : 'No Matching Practices' }}
              </h2>
              <p style="color: #6b7280; margin: 0 0 28px 0; line-height: 1.6; font-size: 14px;">
                {{ filter() === 'all' ? 'Add practices to start building healthy habits that nurture your life areas.' : 'Try a different filter to see your practices.' }}
              </p>
              @if (filter() === 'all') {
                <ion-button expand="block" size="large" style="--background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); --border-radius: 16px; --box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);">
                  <ion-icon name="add-outline" slot="start"></ion-icon>
                  Add Your First Practice
                </ion-button>
              }
            </ion-card-content>
          </ion-card>

          <!-- Suggested Practices - Zen Style -->
          @if (filter() === 'all') {
            <ion-card style="--background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1); overflow: hidden;">
              <ion-card-header style="border-bottom: 1px solid rgba(134, 239, 172, 0.15); padding: 20px;">
                <ion-card-title style="color: #1f2937; font-weight: 600; font-size: 18px;">Suggested Practices</ion-card-title>
                <ion-card-subtitle style="color: #22c55e; font-size: 13px;">Popular habits to get started</ion-card-subtitle>
              </ion-card-header>
              <ion-list style="--ion-item-background: transparent;">
                @for (suggestion of suggestedPractices; track suggestion.name) {
                  <ion-item button style="--padding-start: 16px; --padding-end: 16px;">
                    <ion-avatar slot="start" [style.background]="suggestion.gradient" style="width: 48px; height: 48px; border-radius: 14px;">
                      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 22px;">
                        {{ suggestion.emoji }}
                      </div>
                    </ion-avatar>
                    <ion-label>
                      <h2 style="font-weight: 600; color: #1f2937; font-size: 15px;">{{ suggestion.name }}</h2>
                      <p style="color: #6b7280; font-size: 13px;">{{ suggestion.description }}</p>
                    </ion-label>
                    <ion-button slot="end" fill="clear" style="--color: #22c55e;">
                      <ion-icon name="add-outline" slot="icon-only"></ion-icon>
                    </ion-button>
                  </ion-item>
                }
              </ion-list>
            </ion-card>
          }
        } @else {
          <!-- Practices List - Zen Style -->
          <ion-card style="--background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1); overflow: hidden;">
            <ion-card-header style="border-bottom: 1px solid rgba(134, 239, 172, 0.15); padding: 20px;">
              <ion-card-title style="color: #1f2937; font-weight: 600; font-size: 18px;">{{ getFilterTitle() }}</ion-card-title>
              <ion-card-subtitle style="color: #22c55e; font-size: 13px;">Swipe left to log a practice</ion-card-subtitle>
            </ion-card-header>
            <ion-list style="--ion-item-background: transparent;">
              @for (practice of filteredPractices(); track practice.id) {
                <ion-item-sliding>
                  <ion-item style="--padding-start: 16px; --padding-end: 16px; --inner-padding-end: 0;">
                    <ion-avatar slot="start" [style.background]="getPracticeGradient(practice)" style="width: 52px; height: 52px; border-radius: 16px;">
                      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                        {{ getCategoryEmoji(practice.category) }}
                      </div>
                    </ion-avatar>
                    <ion-label>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="font-weight: 600; color: #1f2937; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                          {{ practice.name }}
                          @if (!practice.isActive) {
                            <span style="font-size: 10px; background: #e5e7eb; color: #6b7280; padding: 2px 8px; border-radius: 10px;">Paused</span>
                          }
                        </h2>
                        @if (practice.currentStreak > 0) {
                          <div style="display: flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%); color: #78350f; padding: 4px 10px; border-radius: 16px; font-weight: 700; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);">
                            <span style="font-size: 14px;">🔥</span>
                            <span style="font-size: 14px;">{{ practice.currentStreak }}</span>
                          </div>
                        }
                      </div>
                      <p style="color: #6b7280; font-size: 13px; margin-top: 2px;">{{ practice.description }}</p>
                      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px;">
                        @if (practice.lifeArea) {
                          <span style="font-size: 11px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; padding: 4px 10px; border-radius: 10px; font-weight: 500;">
                            {{ practice.lifeArea.name }}
                          </span>
                        }
                        <span style="font-size: 11px; background: #f3f4f6; color: #6b7280; padding: 4px 10px; border-radius: 10px; display: flex; align-items: center; gap: 4px;">
                          <ion-icon name="repeat-outline" style="font-size: 12px;"></ion-icon>
                          {{ practice.frequency }}
                        </span>
                        @if (practice.durationMinutes) {
                          <span style="font-size: 11px; background: #f3f4f6; color: #6b7280; padding: 4px 10px; border-radius: 10px; display: flex; align-items: center; gap: 4px;">
                            <ion-icon name="timer-outline" style="font-size: 12px;"></ion-icon>
                            {{ practice.durationMinutes }}m
                          </span>
                        }
                      </div>
                      @if (practice.longestStreak > practice.currentStreak && practice.longestStreak > 0) {
                        <div style="display: flex; align-items: center; gap: 4px; margin-top: 10px; font-size: 12px; color: #9ca3af;">
                          <span>🏆</span>
                          <span>Personal best: {{ practice.longestStreak }} days</span>
                        </div>
                      }
                    </ion-label>
                  </ion-item>
                  <ion-item-options side="end">
                    <ion-item-option
                      (click)="logPractice(practice)"
                      [disabled]="!practice.isActive"
                      style="width: 80px; --background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);"
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

      <!-- FAB for adding new practice - Zen Style -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" style="margin-bottom: 8px; margin-right: 8px;">
        <ion-fab-button style="--background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); --box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);">
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
    { name: 'Morning Meditation', emoji: '🧘', description: '10 minutes of mindful breathing', gradient: 'linear-gradient(135deg, #e9d5ff, #f3e8ff)' },
    { name: 'Daily Exercise', emoji: '💪', description: '30 minutes of physical activity', gradient: 'linear-gradient(135deg, #bbf7d0, #dcfce7)' },
    { name: 'Journaling', emoji: '📝', description: 'Write your thoughts and reflections', gradient: 'linear-gradient(135deg, #bfdbfe, #dbeafe)' },
    { name: 'Reading', emoji: '📚', description: 'Read for 20 minutes', gradient: 'linear-gradient(135deg, #fde68a, #fef3c7)' },
    { name: 'Gratitude Practice', emoji: '🙏', description: 'List 3 things you\'re grateful for', gradient: 'linear-gradient(135deg, #fecdd3, #ffe4e6)' },
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
      return 'linear-gradient(135deg, #e5e7eb, #f3f4f6)';
    }
    if (practice.currentStreak >= 7) {
      return 'linear-gradient(135deg, #fde68a, #fef3c7)'; // soft amber for strong streak
    }
    if (practice.currentStreak > 0) {
      return 'linear-gradient(135deg, #bbf7d0, #dcfce7)'; // soft green for active streak
    }
    return 'linear-gradient(135deg, #bfdbfe, #dbeafe)'; // soft blue for no streak
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
