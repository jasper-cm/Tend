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
  IonAvatar,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leafOutline,
  flameOutline,
  flame,
  checkmarkCircleOutline,
  checkmarkCircle,
  calendarOutline,
  trendingUpOutline,
  sparklesOutline,
  addOutline,
  timerOutline,
  repeatOutline,
  heartOutline,
  arrowBackOutline,
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
    IonAvatar,
    IonFab,
    IonFabButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar [style.--background]="getGradient()" style="--color: white;">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/garden" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title style="color: white;">{{ lifeArea()?.name || 'Life Area' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px;">
          <ion-spinner name="crescent" color="primary" style="width: 48px; height: 48px;"></ion-spinner>
          <p style="margin-top: 16px; color: var(--ion-color-medium);">Loading life area...</p>
        </div>
      } @else if (lifeArea()) {
        <!-- Hero Section -->
        <div [style.background]="getGradient()" style="padding: 24px 24px 80px; color: white; position: relative; overflow: hidden;">
          <!-- Decorative circles -->
          <div style="position: absolute; top: -30%; right: -20%; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: -40%; left: -15%; width: 180px; height: 180px; background: rgba(255,255,255,0.08); border-radius: 50%;"></div>

          <div style="position: relative; z-index: 1; text-align: center;">
            <!-- Icon -->
            <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; border: 2px solid rgba(255,255,255,0.3);">
              <span style="font-size: 40px;">{{ getIcon() }}</span>
            </div>

            <!-- Title & Description -->
            <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">{{ lifeArea()!.name }}</h1>
            <p style="margin: 0; opacity: 0.9; font-size: 15px; line-height: 1.5;">{{ lifeArea()!.description }}</p>
          </div>
        </div>

        <!-- Health Score Card (overlapping) -->
        <div style="margin: -60px 16px 16px; position: relative; z-index: 2;">
          <ion-card style="margin: 0; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
            <ion-card-content style="padding: 24px;">
              <div style="display: flex; align-items: center; gap: 24px;">
                <!-- Health Ring -->
                <div style="position: relative; width: 100px; height: 100px; flex-shrink: 0;">
                  <svg viewBox="0 0 100 100" style="transform: rotate(-90deg); width: 100%; height: 100%;">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      [attr.stroke]="getHealthBgColor()"
                      stroke-width="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      [attr.stroke]="getHealthColor()"
                      stroke-width="10"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="getCircumference()"
                      [attr.stroke-dashoffset]="getStrokeDashoffset()"
                      style="transition: stroke-dashoffset 0.8s ease;"
                    />
                  </svg>
                  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                    <span style="font-size: 28px; font-weight: 700; color: var(--ion-color-dark);">{{ lifeArea()!.healthScore }}</span>
                    <span style="font-size: 12px; color: var(--ion-color-medium); display: block; margin-top: -2px;">%</span>
                  </div>
                </div>

                <!-- Stats -->
                <div style="flex: 1;">
                  <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: var(--ion-color-dark);">{{ getHealthLabel() }}</h3>
                  <p style="margin: 0 0 12px 0; font-size: 13px; color: var(--ion-color-medium);">{{ getHealthDescription() }}</p>
                  <div style="display: flex; gap: 16px;">
                    <div>
                      <span style="font-size: 20px; font-weight: 700; color: var(--ion-color-primary);">{{ practices().length }}</span>
                      <span style="font-size: 12px; color: var(--ion-color-medium); display: block;">Practices</span>
                    </div>
                    <div>
                      <span style="font-size: 20px; font-weight: 700; color: var(--ion-color-secondary);">{{ reflections().length }}</span>
                      <span style="font-size: 12px; color: var(--ion-color-medium); display: block;">Reflections</span>
                    </div>
                  </div>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Tab Segment -->
        <div style="padding: 0 16px 16px;">
          <ion-segment [value]="activeTab()" (ionChange)="switchTab($event)" style="--background: var(--ion-color-light);">
            <ion-segment-button value="practices">
              <ion-icon name="leaf-outline" style="margin-right: 6px;"></ion-icon>
              <ion-label>Practices</ion-label>
            </ion-segment-button>
            <ion-segment-button value="reflections">
              <ion-icon name="calendar-outline" style="margin-right: 6px;"></ion-icon>
              <ion-label>Reflections</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        @if (activeTab() === 'practices') {
          <!-- Practices Section -->
          <div style="padding: 0 16px 100px;">
            @if (practices().length === 0) {
              <ion-card style="margin: 0; border-radius: 16px;">
                <ion-card-content style="text-align: center; padding: 40px 24px;">
                  <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #E8F5E9, #C8E6C9); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                    <span style="font-size: 36px;">🌱</span>
                  </div>
                  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: var(--ion-color-dark);">No Practices Yet</h3>
                  <p style="margin: 0 0 20px 0; color: var(--ion-color-medium); line-height: 1.5;">
                    Add practices to nurture<br>this area of your life.
                  </p>
                  <ion-button expand="block" style="--border-radius: 12px;">
                    <ion-icon name="add-outline" slot="start"></ion-icon>
                    Add Practice
                  </ion-button>
                </ion-card-content>
              </ion-card>
            } @else {
              <!-- Section Header -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                  <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: var(--ion-color-dark);">Your Practices</h3>
                  <p style="margin: 4px 0 0; font-size: 13px; color: var(--ion-color-medium);">
                    {{ activePracticeCount() }} active · Swipe left to log
                  </p>
                </div>
              </div>

              <ion-card style="margin: 0; border-radius: 16px; overflow: hidden;">
                <ion-list style="padding: 0;">
                  @for (practice of practices(); track practice.id; let last = $last) {
                    <ion-item-sliding>
                      <ion-item [style.--border-color]="last ? 'transparent' : 'var(--ion-color-light)'" style="--padding-start: 16px; --inner-padding-end: 16px;">
                        <ion-avatar slot="start" [style.background]="getPracticeGradient(practice)" style="width: 48px; height: 48px; border-radius: 14px;">
                          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                            <ion-icon [name]="practice.isActive ? 'leaf-outline' : 'timer-outline'" style="font-size: 22px; color: white;"></ion-icon>
                          </div>
                        </ion-avatar>
                        <ion-label>
                          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <h2 style="font-weight: 600; margin: 0; font-size: 16px;">{{ practice.name }}</h2>
                            @if (!practice.isActive) {
                              <ion-badge color="medium" style="font-size: 10px; padding: 3px 6px;">Paused</ion-badge>
                            }
                            @if (practice.currentStreak > 0) {
                              <div style="display: flex; align-items: center; gap: 3px; background: linear-gradient(135deg, #FF9800, #FF5722); padding: 3px 8px; border-radius: 10px;">
                                <ion-icon name="flame" style="font-size: 12px; color: white;"></ion-icon>
                                <span style="font-size: 11px; font-weight: 600; color: white;">{{ practice.currentStreak }}</span>
                              </div>
                            }
                          </div>
                          <p style="color: var(--ion-color-medium-shade); margin: 0 0 8px 0; font-size: 13px;">{{ practice.description }}</p>
                          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <ion-chip size="small" outline style="height: 24px; font-size: 11px; margin: 0;">
                              <ion-icon name="repeat-outline" style="font-size: 12px; margin-right: 4px;"></ion-icon>
                              {{ practice.frequency }}
                            </ion-chip>
                            @if (practice.duration) {
                              <ion-chip size="small" outline style="height: 24px; font-size: 11px; margin: 0;">
                                <ion-icon name="timer-outline" style="font-size: 12px; margin-right: 4px;"></ion-icon>
                                {{ practice.duration }}m
                              </ion-chip>
                            }
                          </div>
                        </ion-label>
                      </ion-item>
                      <ion-item-options side="end">
                        <ion-item-option
                          color="success"
                          (click)="logPractice(practice)"
                          [disabled]="!practice.isActive"
                          style="width: 72px;"
                        >
                          <div style="display: flex; flex-direction: column; align-items: center;">
                            <ion-icon name="checkmark-circle" style="font-size: 26px;"></ion-icon>
                            <span style="font-size: 11px; margin-top: 4px;">Log</span>
                          </div>
                        </ion-item-option>
                      </ion-item-options>
                    </ion-item-sliding>
                  }
                </ion-list>
              </ion-card>
            }
          </div>
        } @else {
          <!-- Reflections Section -->
          <div style="padding: 0 16px 100px;">
            @if (reflections().length === 0) {
              <ion-card style="margin: 0; border-radius: 16px;">
                <ion-card-content style="text-align: center; padding: 40px 24px;">
                  <div style="width: 72px; height: 72px; background: linear-gradient(135deg, #E3F2FD, #BBDEFB); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                    <span style="font-size: 36px;">📝</span>
                  </div>
                  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: var(--ion-color-dark);">No Reflections Yet</h3>
                  <p style="margin: 0; color: var(--ion-color-medium); line-height: 1.5;">
                    Journal entries tagged with<br>this life area will appear here.
                  </p>
                </ion-card-content>
              </ion-card>
            } @else {
              <!-- Section Header -->
              <div style="margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: var(--ion-color-dark);">Your Reflections</h3>
                <p style="margin: 4px 0 0; font-size: 13px; color: var(--ion-color-medium);">
                  {{ reflections().length }} journal {{ reflections().length === 1 ? 'entry' : 'entries' }}
                </p>
              </div>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                @for (reflection of reflections(); track reflection.id) {
                  <ion-card style="margin: 0; border-radius: 16px;">
                    <ion-card-content style="padding: 16px;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <div style="flex: 1;">
                          <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: var(--ion-color-dark);">{{ reflection.title }}</h3>
                          <div style="display: flex; align-items: center; gap: 4px; color: var(--ion-color-medium); font-size: 12px;">
                            <ion-icon name="calendar-outline" style="font-size: 14px;"></ion-icon>
                            <span>{{ formatDate(reflection.createdAt) }}</span>
                          </div>
                        </div>
                        @if (reflection.mood) {
                          <div [style.background]="getMoodGradient(reflection.mood)" style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 22px;">{{ getMoodEmoji(reflection.mood) }}</span>
                          </div>
                        }
                      </div>

                      <p style="margin: 0 0 12px 0; color: var(--ion-color-medium-shade); font-size: 14px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        {{ reflection.content }}
                      </p>

                      @if (reflection.gratitude && reflection.gratitude.length > 0) {
                        <div style="display: flex; align-items: center; gap: 6px; padding-top: 12px; border-top: 1px solid var(--ion-color-light);">
                          <ion-icon name="heart-outline" color="danger" style="font-size: 16px;"></ion-icon>
                          <span style="font-size: 13px; color: var(--ion-color-medium);">
                            {{ reflection.gratitude.length }} gratitude{{ reflection.gratitude.length > 1 ? 's' : '' }}
                          </span>
                        </div>
                      }
                    </ion-card-content>
                  </ion-card>
                }
              </div>
            }
          </div>
        }
      }

      <!-- FAB for adding -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" style="margin-bottom: 16px; margin-right: 16px;">
        <ion-fab-button color="primary">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
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
    home: '🏠',
    star: '⭐',
    sun: '☀️',
    moon: '🌙',
    music: '🎵',
    camera: '📷',
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
      flame,
      checkmarkCircleOutline,
      checkmarkCircle,
      calendarOutline,
      trendingUpOutline,
      sparklesOutline,
      addOutline,
      timerOutline,
      repeatOutline,
      heartOutline,
      arrowBackOutline,
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
    const color = this.lifeArea()?.color || '#4CAF50';
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

  getCircumference(): number {
    return 2 * Math.PI * 42;
  }

  getStrokeDashoffset(): number {
    const circumference = this.getCircumference();
    const health = this.lifeArea()?.healthScore || 0;
    return circumference - (health / 100) * circumference;
  }

  getHealthColor(): string {
    const health = this.lifeArea()?.healthScore || 0;
    if (health >= 70) return '#4CAF50';
    if (health >= 40) return '#FF9800';
    return '#f44336';
  }

  getHealthBgColor(): string {
    const health = this.lifeArea()?.healthScore || 0;
    if (health >= 70) return '#E8F5E9';
    if (health >= 40) return '#FFF3E0';
    return '#FFEBEE';
  }

  getHealthLabel(): string {
    const health = this.lifeArea()?.healthScore || 0;
    if (health >= 70) return 'Thriving';
    if (health >= 40) return 'Growing';
    return 'Needs Care';
  }

  getHealthDescription(): string {
    const health = this.lifeArea()?.healthScore || 0;
    if (health >= 70) return 'This area of your life is flourishing beautifully!';
    if (health >= 40) return 'Making progress - keep up the good work!';
    return 'This area could use some extra attention and care.';
  }

  getPracticeGradient(practice: Practice): string {
    if (!practice.isActive) {
      return 'linear-gradient(135deg, #9E9E9E, #757575)';
    }
    if (practice.currentStreak >= 7) {
      return 'linear-gradient(135deg, #FF9800, #FF5722)';
    }
    if (practice.currentStreak > 0) {
      return 'linear-gradient(135deg, #4CAF50, #2E7D32)';
    }
    return 'linear-gradient(135deg, #2196F3, #1976D2)';
  }

  getMoodEmoji(mood: string): string {
    return this.moodEmojis[mood.toLowerCase()] || '😐';
  }

  getMoodGradient(mood: string): string {
    switch (mood?.toLowerCase()) {
      case 'great':
        return 'linear-gradient(135deg, #E8F5E9, #C8E6C9)';
      case 'good':
        return 'linear-gradient(135deg, #F1F8E9, #DCEDC8)';
      case 'okay':
        return 'linear-gradient(135deg, #FFF8E1, #FFECB3)';
      case 'low':
        return 'linear-gradient(135deg, #FFF3E0, #FFE0B2)';
      case 'difficult':
        return 'linear-gradient(135deg, #FFEBEE, #FFCDD2)';
      default:
        return 'linear-gradient(135deg, #F5F5F5, #E0E0E0)';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
