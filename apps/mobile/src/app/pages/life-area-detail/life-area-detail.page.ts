import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  IonBackButton,
  IonIcon,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonProgressBar,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leafOutline,
  flameOutline,
  checkmarkCircleOutline,
  calendarOutline,
  trendingUpOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { ApiService, LifeArea, Practice, Reflection } from '../../services/api.service';

@Component({
  selector: 'tend-life-area-detail-page',
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
    IonButtons,
    IonBackButton,
    IonIcon,
    IonChip,
    IonRefresher,
    IonRefresherContent,
    IonProgressBar,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonSegment,
    IonSegmentButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/garden"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ lifeArea()?.name || 'Life Area' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div class="loading-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p>Loading...</p>
        </div>
      } @else if (lifeArea()) {
        <!-- Hero Card -->
        <div class="hero-section" [style.background]="getGradient()">
          <div class="hero-content">
            <div class="hero-icon">{{ getIcon() }}</div>
            <h1 class="hero-title">{{ lifeArea()!.name }}</h1>
            <p class="hero-description">{{ lifeArea()!.description }}</p>

            <div class="health-ring">
              <svg viewBox="0 0 120 120" class="progress-ring">
                <circle
                  class="progress-ring-bg"
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  stroke-width="8"
                />
                <circle
                  class="progress-ring-fill"
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="white"
                  stroke-width="8"
                  stroke-linecap="round"
                  [style.strokeDasharray]="getStrokeDasharray()"
                  [style.strokeDashoffset]="getStrokeDashoffset()"
                />
              </svg>
              <div class="health-value">
                <span class="health-number">{{ lifeArea()!.healthScore }}</span>
                <span class="health-label">Health</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Segment -->
        <ion-segment [value]="activeTab()" (ionChange)="switchTab($event)" class="detail-segment">
          <ion-segment-button value="practices">
            <ion-label>Practices</ion-label>
          </ion-segment-button>
          <ion-segment-button value="reflections">
            <ion-label>Reflections</ion-label>
          </ion-segment-button>
        </ion-segment>

        @if (activeTab() === 'practices') {
          <!-- Practices Section -->
          @if (practices().length === 0) {
            <ion-card>
              <ion-card-content class="empty-state">
                <div class="empty-icon">🌱</div>
                <h3>No practices yet</h3>
                <p>Add practices to nurture this area of your life.</p>
              </ion-card-content>
            </ion-card>
          } @else {
            <div class="section-header">
              <span class="section-title">{{ practices().length }} Practice{{ practices().length !== 1 ? 's' : '' }}</span>
              <span class="section-subtitle">{{ activePracticeCount() }} active</span>
            </div>

            <ion-list class="practice-list">
              @for (practice of practices(); track practice.id) {
                <ion-item-sliding>
                  <ion-item class="practice-item">
                    <div class="practice-content" slot="start">
                      <div class="practice-icon" [class.inactive]="!practice.isActive">
                        <ion-icon name="leaf-outline"></ion-icon>
                      </div>
                    </div>
                    <ion-label>
                      <h2 class="practice-name">
                        {{ practice.name }}
                        @if (!practice.isActive) {
                          <ion-badge color="medium">Paused</ion-badge>
                        }
                      </h2>
                      <p class="practice-description">{{ practice.description }}</p>
                      <div class="practice-meta">
                        <ion-chip size="small" outline>{{ practice.frequency }}</ion-chip>
                        @if (practice.currentStreak > 0) {
                          <div class="streak-indicator">
                            <ion-icon name="flame-outline" color="warning"></ion-icon>
                            <span>{{ practice.currentStreak }} day streak</span>
                          </div>
                        }
                      </div>
                    </ion-label>
                  </ion-item>
                  <ion-item-options side="end">
                    <ion-item-option color="success" (click)="logPractice(practice)">
                      <ion-icon slot="icon-only" name="checkmark-circle-outline"></ion-icon>
                    </ion-item-option>
                  </ion-item-options>
                </ion-item-sliding>
              }
            </ion-list>
          }
        } @else {
          <!-- Reflections Section -->
          @if (reflections().length === 0) {
            <ion-card>
              <ion-card-content class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>No reflections yet</h3>
                <p>Journal entries tagged with this life area will appear here.</p>
              </ion-card-content>
            </ion-card>
          } @else {
            <div class="section-header">
              <span class="section-title">{{ reflections().length }} Reflection{{ reflections().length !== 1 ? 's' : '' }}</span>
            </div>

            @for (reflection of reflections(); track reflection.id) {
              <ion-card class="reflection-card">
                <ion-card-header>
                  <div class="reflection-header">
                    <ion-card-title>{{ reflection.title }}</ion-card-title>
                    @if (reflection.mood) {
                      <span class="mood-emoji">{{ getMoodEmoji(reflection.mood) }}</span>
                    }
                  </div>
                  <ion-card-subtitle>
                    <ion-icon name="calendar-outline"></ion-icon>
                    {{ formatDate(reflection.createdAt) }}
                  </ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  <p class="reflection-content">{{ reflection.content | slice:0:200 }}{{ reflection.content.length > 200 ? '...' : '' }}</p>
                  @if (reflection.gratitude && reflection.gratitude.length > 0) {
                    <div class="gratitude-section">
                      <ion-icon name="sparkles-outline" color="warning"></ion-icon>
                      <span>{{ reflection.gratitude.length }} gratitude item{{ reflection.gratitude.length !== 1 ? 's' : '' }}</span>
                    </div>
                  }
                </ion-card-content>
              </ion-card>
            }
          }
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

    .hero-section {
      padding: 32px 24px;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -30%;
      width: 80%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 1;
      text-align: center;
    }

    .hero-icon {
      font-size: 48px;
      margin-bottom: 12px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }

    .hero-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }

    .hero-description {
      font-size: 15px;
      opacity: 0.9;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }

    .health-ring {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto;
    }

    .progress-ring {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }

    .progress-ring-fill {
      transition: stroke-dashoffset 0.5s ease;
    }

    .health-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .health-number {
      display: block;
      font-size: 32px;
      font-weight: 700;
      line-height: 1;
    }

    .health-label {
      display: block;
      font-size: 11px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 4px;
    }

    .detail-segment {
      margin: 16px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 8px;
    }

    .section-title {
      font-weight: 600;
      color: var(--ion-color-dark);
    }

    .section-subtitle {
      font-size: 13px;
      color: var(--ion-color-medium);
    }

    .practice-list {
      background: transparent;
    }

    .practice-item {
      --padding-start: 16px;
      --inner-padding-end: 16px;
    }

    .practice-content {
      margin-right: 12px;
    }

    .practice-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }

    .practice-icon.inactive {
      background: var(--ion-color-medium-tint);
    }

    .practice-name {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .practice-name ion-badge {
      font-size: 10px;
    }

    .practice-description {
      color: var(--ion-color-medium-shade);
      margin: 4px 0 8px;
    }

    .practice-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .practice-meta ion-chip {
      height: 24px;
      font-size: 11px;
    }

    .streak-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--ion-color-warning-shade);
      font-weight: 500;
    }

    .streak-indicator ion-icon {
      font-size: 14px;
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

    .reflection-card {
      margin: 16px;
    }

    .reflection-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .mood-emoji {
      font-size: 24px;
    }

    ion-card-subtitle {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
    }

    ion-card-subtitle ion-icon {
      font-size: 14px;
    }

    .reflection-content {
      white-space: pre-line;
      color: var(--ion-color-medium-shade);
      line-height: 1.6;
    }

    .gratitude-section {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--ion-color-light-shade);
      font-size: 13px;
      color: var(--ion-color-warning-shade);
    }
  `],
})
export class LifeAreaDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

  lifeArea = signal<LifeArea | null>(null);
  practices = signal<Practice[]>([]);
  reflections = signal<Reflection[]>([]);
  loading = signal(true);
  activeTab = signal<'practices' | 'reflections'>('practices');

  private iconMap: Record<string, string> = {
    heart: '❤️',
    brain: '🧠',
    briefcase: '💼',
    dumbbell: '💪',
    book: '📚',
    palette: '🎨',
    users: '👥',
    dollar: '💰',
    leaf: '🌿',
  };

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
      leafOutline,
      flameOutline,
      checkmarkCircleOutline,
      calendarOutline,
      trendingUpOutline,
      sparklesOutline,
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLifeArea(id);
    }
  }

  handleRefresh(event: CustomEvent): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLifeArea(id);
    }
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  private loadLifeArea(id: string): void {
    this.loading.set(true);

    this.api.getLifeArea(id).subscribe({
      next: (lifeArea) => {
        this.lifeArea.set(lifeArea);
        this.practices.set(lifeArea.practices || []);

        // Extract reflections from the nested structure
        const reflections = (lifeArea.reflections || [])
          .map((r) => r.reflection)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.reflections.set(reflections);

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  switchTab(event: CustomEvent): void {
    this.activeTab.set(event.detail.value as 'practices' | 'reflections');
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

  activePracticeCount(): number {
    return this.practices().filter((p) => p.isActive).length;
  }

  getIcon(): string {
    const icon = this.lifeArea()?.icon || 'leaf';
    return this.iconMap[icon] || '🌿';
  }

  getGradient(): string {
    const color = this.lifeArea()?.color || '#3d9a50';
    return `linear-gradient(135deg, ${color} 0%, ${this.darkenColor(color)} 100%)`;
  }

  private darkenColor(hex: string): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = -40;
    const R = Math.max(0, (num >> 16) + amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) + amt);
    const B = Math.max(0, (num & 0x0000ff) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  getStrokeDasharray(): string {
    const circumference = 2 * Math.PI * 52;
    return `${circumference}`;
  }

  getStrokeDashoffset(): string {
    const circumference = 2 * Math.PI * 52;
    const health = this.lifeArea()?.healthScore || 0;
    const offset = circumference - (health / 100) * circumference;
    return `${offset}`;
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
}
