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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flameOutline, checkmarkCircleOutline, pauseCircleOutline, trophyOutline } from 'ionicons/icons';
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
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Practices</ion-title>
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
            <ion-label>On Streak</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div class="loading-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p>Loading practices...</p>
        </div>
      } @else {
        <!-- Streak Summary Card -->
        @if (practices().length > 0) {
          <ion-card class="streak-summary-card">
            <ion-card-content>
              <div class="streak-stats">
                <div class="streak-stat">
                  <div class="streak-value">{{ totalStreakDays() }}</div>
                  <div class="streak-label">Total Streak Days</div>
                </div>
                <div class="streak-stat">
                  <div class="streak-value">{{ longestStreak() }}</div>
                  <div class="streak-label">Longest Streak</div>
                </div>
                <div class="streak-stat">
                  <div class="streak-value">{{ onStreakCount() }}</div>
                  <div class="streak-label">Active Streaks</div>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        }

        @if (filteredPractices().length === 0) {
          <ion-card>
            <ion-card-content class="empty-state">
              <div class="empty-icon">🌱</div>
              <h3>{{ filter() === 'all' ? 'No practices yet' : 'No matching practices' }}</h3>
              <p>{{ filter() === 'all' ? 'Add practices to start building healthy habits.' : 'Try a different filter.' }}</p>
            </ion-card-content>
          </ion-card>
        } @else {
          <ion-list>
            @for (practice of filteredPractices(); track practice.id) {
              <ion-item-sliding>
                <ion-item>
                  <ion-label>
                    <div class="practice-header">
                      <h2>
                        {{ practice.name }}
                        @if (!practice.isActive) {
                          <ion-badge color="medium" class="status-badge">Paused</ion-badge>
                        }
                      </h2>
                      @if (practice.currentStreak > 0) {
                        <div class="streak-badge">
                          <ion-icon name="flame-outline" color="warning"></ion-icon>
                          <span class="streak-count">{{ practice.currentStreak }}</span>
                        </div>
                      }
                    </div>
                    <p>{{ practice.description }}</p>
                    <div class="practice-meta">
                      <ion-chip size="small" color="tertiary">
                        {{ practice.lifeArea?.name || 'Unknown Area' }}
                      </ion-chip>
                      <ion-chip size="small" outline>
                        {{ practice.category }}
                      </ion-chip>
                      <ion-chip size="small" outline>
                        {{ practice.frequency }}
                      </ion-chip>
                    </div>
                    @if (practice.longestStreak > practice.currentStreak) {
                      <div class="best-streak">
                        <ion-icon name="trophy-outline"></ion-icon>
                        Best: {{ practice.longestStreak }} days
                      </div>
                    }
                  </ion-label>
                </ion-item>
                <ion-item-options side="end">
                  <ion-item-option
                    color="success"
                    (click)="logPractice(practice)"
                    [disabled]="!practice.isActive"
                  >
                    <ion-icon slot="icon-only" name="checkmark-circle-outline"></ion-icon>
                  </ion-item-option>
                </ion-item-options>
              </ion-item-sliding>
            }
          </ion-list>
        }
      }
    </ion-content>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: var(--ion-color-medium);
    }

    .streak-summary-card {
      --background: linear-gradient(135deg, #3d9a50 0%, #5fb56f 100%);
      color: white;
      margin: 16px;
    }

    .streak-stats {
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .streak-stat {
      flex: 1;
    }

    .streak-value {
      font-size: 32px;
      font-weight: bold;
    }

    .streak-label {
      font-size: 11px;
      opacity: 0.9;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: var(--ion-color-dark);
    }

    .empty-state p {
      margin: 0;
      color: var(--ion-color-medium);
    }

    .practice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .practice-header h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-badge {
      font-size: 10px;
      padding: 2px 6px;
    }

    .streak-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
      color: white;
      padding: 4px 10px;
      border-radius: 16px;
      font-weight: bold;
    }

    .streak-count {
      font-size: 18px;
    }

    .practice-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
    }

    .practice-meta ion-chip {
      height: 24px;
      font-size: 11px;
    }

    .best-streak {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 8px;
      font-size: 12px;
      color: var(--ion-color-medium);
    }

    .best-streak ion-icon {
      font-size: 14px;
      color: var(--ion-color-warning);
    }
  `],
})
export class PracticesPage implements OnInit {
  private api = inject(ApiService);

  practices = signal<Practice[]>([]);
  loading = signal(true);
  filter = signal<'all' | 'active' | 'streaks'>('all');

  totalStreakDays = signal(0);
  longestStreak = signal(0);
  onStreakCount = signal(0);

  constructor() {
    addIcons({
      flameOutline,
      checkmarkCircleOutline,
      pauseCircleOutline,
      trophyOutline,
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
