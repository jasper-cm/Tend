import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonProgressBar,
  IonAvatar,
  IonNote,
  IonText,
  IonChip,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leafOutline,
  leaf,
  addOutline,
  sparklesOutline,
  trendingUpOutline,
  alertCircleOutline,
  chevronForwardOutline,
  sunnyOutline,
  waterOutline,
  heartOutline,
  fitnessOutline,
  briefcaseOutline,
  bookOutline,
  peopleOutline,
  walletOutline,
  colorPaletteOutline,
  ribbonOutline,
  menuOutline,
} from 'ionicons/icons';
import { ApiService, LifeArea } from '../../services/api.service';

@Component({
  selector: 'tend-garden-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
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
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonProgressBar,
    IonAvatar,
    IonNote,
    IonText,
    IonChip,
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
          <ion-icon name="leaf" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
          My Garden
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2); animation: breathe 4s ease-in-out infinite;">
            <span style="font-size: 40px;">🌱</span>
          </div>
          <p style="margin-top: 20px; color: #22c55e; font-weight: 500;">Growing your garden...</p>
          <div style="display: flex; gap: 6px; margin-top: 12px;">
            <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: bounce 1s ease-in-out infinite;"></div>
            <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: bounce 1s ease-in-out 0.1s infinite;"></div>
            <div style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: bounce 1s ease-in-out 0.2s infinite;"></div>
          </div>
        </div>
      } @else {
        <!-- Welcome Card - Zen Style -->
        <ion-card style="--background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%); border-radius: 24px; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.15); border: 1px solid rgba(134, 239, 172, 0.3); position: relative; overflow: hidden; margin-bottom: 20px;">
          <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(134, 239, 172, 0.3) 0%, transparent 70%); pointer-events: none;"></div>
          <ion-card-header style="padding-bottom: 8px;">
            <ion-card-subtitle style="color: #16a34a; font-weight: 500; letter-spacing: 0.02em;">{{ getGreeting() }}</ion-card-subtitle>
            <ion-card-title style="font-size: 26px; color: #166534; font-weight: 700;">Your Life Garden</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p style="margin-bottom: 20px; color: #4ade80; font-size: 14px; line-height: 1.5;">
              Nurture every dimension of your life. Each area is a sacred plot in your personal garden of growth.
            </p>
            @if (lifeAreas().length > 0) {
              <div style="display: flex; gap: 24px; padding-top: 16px; border-top: 1px solid rgba(134, 239, 172, 0.3);">
                <div style="text-align: center;">
                  <div style="font-size: 36px; font-weight: 700; color: #166534;">{{ averageHealth() }}%</div>
                  <div style="font-size: 12px; color: #22c55e; font-weight: 500;">Garden Health</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 36px; font-weight: 700; color: #166534;">{{ lifeAreas().length }}</div>
                  <div style="font-size: 12px; color: #22c55e; font-weight: 500;">Life Areas</div>
                </div>
              </div>
            }
          </ion-card-content>
        </ion-card>

        @if (lifeAreas().length > 0) {
          <!-- Stats Cards - Zen Style -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
            <ion-card style="margin: 0; --background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 20px rgba(34, 197, 94, 0.08);">
              <ion-card-content style="text-align: center; padding: 16px 12px;">
                <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                  <span style="font-size: 20px;">✨</span>
                </div>
                <div style="font-size: 28px; font-weight: 700; color: #22c55e;">{{ thrivingCount() }}</div>
                <div style="font-size: 11px; color: #6b7280; font-weight: 500;">Thriving</div>
              </ion-card-content>
            </ion-card>
            <ion-card style="margin: 0; --background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 20px rgba(34, 197, 94, 0.08);">
              <ion-card-content style="text-align: center; padding: 16px 12px;">
                <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                  <span style="font-size: 20px;">🌻</span>
                </div>
                <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">{{ growingCount() }}</div>
                <div style="font-size: 11px; color: #6b7280; font-weight: 500;">Growing</div>
              </ion-card-content>
            </ion-card>
            <ion-card style="margin: 0; --background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 20px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 20px rgba(34, 197, 94, 0.08);">
              <ion-card-content style="text-align: center; padding: 16px 12px;">
                <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #ffe4e6, #fecdd3); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                  <span style="font-size: 20px;">💧</span>
                </div>
                <div style="font-size: 28px; font-weight: 700; color: #f43f5e;">{{ needsCareCount() }}</div>
                <div style="font-size: 11px; color: #6b7280; font-weight: 500;">Needs Care</div>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Life Areas Section - Zen Style -->
          <ion-card style="--background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1); overflow: hidden;">
            <ion-card-header style="border-bottom: 1px solid rgba(134, 239, 172, 0.15); padding: 20px;">
              <ion-card-title style="color: #1f2937; font-weight: 600; font-size: 18px;">Life Areas</ion-card-title>
              <ion-card-subtitle style="color: #22c55e; font-size: 13px;">Tap an area to see details</ion-card-subtitle>
            </ion-card-header>
            <ion-list style="--ion-item-background: transparent;">
              @for (area of lifeAreas(); track area.id) {
                <ion-item [routerLink]="['/life-areas', area.id]" detail="true" button style="--padding-start: 16px; --padding-end: 16px; --inner-padding-end: 8px;">
                  <ion-avatar slot="start" [style.background]="getHealthGradient(area.healthScore)" style="width: 52px; height: 52px; border-radius: 16px;">
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                      {{ getEmoji(area.icon) }}
                    </div>
                  </ion-avatar>
                  <ion-label>
                    <h2 style="font-weight: 600; color: #1f2937; font-size: 15px;">{{ area.name }}</h2>
                    <p style="color: #6b7280; font-size: 13px; margin-top: 2px;">{{ area.description }}</p>
                    <div style="margin-top: 10px; height: 6px; background: rgba(134, 239, 172, 0.2); border-radius: 3px; overflow: hidden;">
                      <div
                        [style.width.%]="area.healthScore"
                        [style.background]="'linear-gradient(90deg, ' + getHealthColorHex(area.healthScore) + ', ' + getHealthColorLight(area.healthScore) + ')'"
                        style="height: 100%; border-radius: 3px; transition: width 0.5s ease;"
                      ></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 6px;">
                      <span style="font-size: 11px; color: #6b7280;">{{ getHealthLabel(area.healthScore) }}</span>
                      <span style="font-size: 12px; font-weight: 600;" [style.color]="getHealthColorHex(area.healthScore)">{{ area.healthScore }}%</span>
                    </div>
                  </ion-label>
                </ion-item>
              }
            </ion-list>
          </ion-card>

          <!-- Quick Actions - Zen Style -->
          <ion-card style="--background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1);">
            <ion-card-header>
              <ion-card-title style="color: #1f2937; font-weight: 600; font-size: 18px;">Quick Actions</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <ion-button routerLink="/practices" expand="block" fill="outline" style="--border-radius: 16px; --border-color: rgba(134, 239, 172, 0.4); --color: #22c55e; --background-hover: rgba(34, 197, 94, 0.08); flex: 1; min-width: 120px;">
                  <ion-icon name="fitness-outline" slot="start"></ion-icon>
                  Log Practice
                </ion-button>
                <ion-button routerLink="/reflections" expand="block" fill="outline" style="--border-radius: 16px; --border-color: rgba(134, 239, 172, 0.4); --color: #22c55e; --background-hover: rgba(34, 197, 94, 0.08); flex: 1; min-width: 120px;">
                  <ion-icon name="book-outline" slot="start"></ion-icon>
                  Reflect
                </ion-button>
                <ion-button routerLink="/guide" expand="block" fill="outline" style="--border-radius: 16px; --border-color: rgba(134, 239, 172, 0.4); --color: #22c55e; --background-hover: rgba(34, 197, 94, 0.08); flex: 1; min-width: 120px;">
                  <ion-icon name="sparkles-outline" slot="start"></ion-icon>
                  Ask Guide
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        } @else {
          <!-- Empty State - Zen Style -->
          <ion-card style="--background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1);">
            <ion-card-content style="text-align: center; padding: 48px 24px;">
              <div style="width: 96px; height: 96px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2);">
                <span style="font-size: 48px;">🌱</span>
              </div>
              <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 12px 0; color: #1f2937;">
                Begin Your Journey
              </h2>
              <p style="color: #6b7280; margin: 0 0 28px 0; line-height: 1.6; font-size: 14px;">
                Start building your garden by adding life areas to tend.<br>
                Each area represents a sacred dimension of your life.
              </p>
              <ion-button expand="block" size="large" style="--background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); --border-radius: 16px; --box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);">
                <ion-icon name="add-outline" slot="start"></ion-icon>
                Plant Your First Seed
              </ion-button>
            </ion-card-content>
          </ion-card>

          <!-- Suggested Life Areas - Zen Style -->
          <ion-card style="--background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.2); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1); overflow: hidden;">
            <ion-card-header style="border-bottom: 1px solid rgba(134, 239, 172, 0.15); padding: 20px;">
              <ion-card-title style="color: #1f2937; font-weight: 600; font-size: 18px;">Suggested Life Areas</ion-card-title>
              <ion-card-subtitle style="color: #22c55e; font-size: 13px;">Common areas people tend</ion-card-subtitle>
            </ion-card-header>
            <ion-list style="--ion-item-background: transparent;">
              @for (suggestion of suggestedAreas; track suggestion.name) {
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

          <!-- Tips Card - Zen Style -->
          <ion-card style="--background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 24px; border: 1px solid rgba(134, 239, 172, 0.3); box-shadow: 0 4px 24px rgba(34, 197, 94, 0.1);">
            <ion-card-header>
              <ion-card-title style="color: #166534; font-weight: 600; font-size: 18px;">
                <ion-icon name="sunny-outline" style="margin-right: 8px; vertical-align: middle; color: #22c55e;"></ion-icon>
                Getting Started Tips
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list lines="none" style="background: transparent;">
                <ion-item style="--background: transparent; --padding-start: 0;">
                  <div slot="start" style="width: 36px; height: 36px; background: rgba(255, 255, 255, 0.7); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <ion-icon name="leaf-outline" style="color: #22c55e; font-size: 18px;"></ion-icon>
                  </div>
                  <ion-label class="ion-text-wrap">
                    <p style="color: #374151;"><strong style="color: #166534;">Start Small</strong> — Begin with 2-3 life areas you want to focus on</p>
                  </ion-label>
                </ion-item>
                <ion-item style="--background: transparent; --padding-start: 0;">
                  <div slot="start" style="width: 36px; height: 36px; background: rgba(255, 255, 255, 0.7); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <ion-icon name="water-outline" style="color: #22c55e; font-size: 18px;"></ion-icon>
                  </div>
                  <ion-label class="ion-text-wrap">
                    <p style="color: #374151;"><strong style="color: #166534;">Be Consistent</strong> — Regular small actions grow healthy habits</p>
                  </ion-label>
                </ion-item>
                <ion-item style="--background: transparent; --padding-start: 0;">
                  <div slot="start" style="width: 36px; height: 36px; background: rgba(255, 255, 255, 0.7); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <ion-icon name="ribbon-outline" style="color: #22c55e; font-size: 18px;"></ion-icon>
                  </div>
                  <ion-label class="ion-text-wrap">
                    <p style="color: #374151;"><strong style="color: #166534;">Celebrate Progress</strong> — Every step forward matters</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        }
      }

      <!-- FAB for adding new life area - Zen Style -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end" style="margin-bottom: 8px; margin-right: 8px;">
        <ion-fab-button style="--background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); --box-shadow: 0 8px 24px rgba(34, 197, 94, 0.35);">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class GardenPage implements OnInit {
  private api = inject(ApiService);

  lifeAreas = signal<LifeArea[]>([]);
  loading = signal(true);
  averageHealth = signal(0);
  thrivingCount = signal(0);
  growingCount = signal(0);
  needsCareCount = signal(0);

  suggestedAreas = [
    { name: 'Health & Fitness', emoji: '💪', description: 'Physical wellbeing and exercise', gradient: 'linear-gradient(135deg, #bbf7d0, #dcfce7)' },
    { name: 'Career & Work', emoji: '💼', description: 'Professional growth and goals', gradient: 'linear-gradient(135deg, #bfdbfe, #dbeafe)' },
    { name: 'Relationships', emoji: '❤️', description: 'Family, friends, and connections', gradient: 'linear-gradient(135deg, #fecdd3, #ffe4e6)' },
    { name: 'Personal Growth', emoji: '🧠', description: 'Learning and self-improvement', gradient: 'linear-gradient(135deg, #e9d5ff, #f3e8ff)' },
    { name: 'Finances', emoji: '💰', description: 'Money management and savings', gradient: 'linear-gradient(135deg, #fde68a, #fef3c7)' },
    { name: 'Creativity', emoji: '🎨', description: 'Art, hobbies, and expression', gradient: 'linear-gradient(135deg, #a5f3fc, #cffafe)' },
  ];

  private iconEmojis: Record<string, string> = {
    leaf: '🌿', heart: '❤️', brain: '🧠', briefcase: '💼',
    dumbbell: '💪', book: '📚', palette: '🎨', users: '👥', dollar: '💰',
  };

  constructor() {
    addIcons({
      leafOutline, leaf, addOutline, sparklesOutline, trendingUpOutline,
      alertCircleOutline, chevronForwardOutline, sunnyOutline, waterOutline,
      heartOutline, fitnessOutline, briefcaseOutline, bookOutline,
      peopleOutline, walletOutline, colorPaletteOutline, ribbonOutline, menuOutline,
    });
  }

  ngOnInit(): void {
    this.loadGarden();
  }

  handleRefresh(event: CustomEvent): void {
    this.loadGarden();
    setTimeout(() => (event.target as HTMLIonRefresherElement).complete(), 1000);
  }

  private loadGarden(): void {
    this.loading.set(true);
    this.api.getLifeAreas().subscribe({
      next: (areas) => {
        this.lifeAreas.set(areas);
        if (areas.length > 0) {
          const avg = Math.round(areas.reduce((sum, a) => sum + a.healthScore, 0) / areas.length);
          this.averageHealth.set(avg);
          this.thrivingCount.set(areas.filter(a => a.healthScore >= 75).length);
          this.growingCount.set(areas.filter(a => a.healthScore >= 50 && a.healthScore < 75).length);
          this.needsCareCount.set(areas.filter(a => a.healthScore < 50).length);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getHealthColor(score: number): string {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  }

  getHealthColorHex(score: number): string {
    if (score >= 75) return '#22c55e'; // green-500
    if (score >= 50) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  }

  getHealthColorLight(score: number): string {
    if (score >= 75) return '#86efac'; // green-300
    if (score >= 50) return '#fcd34d'; // amber-300
    return '#fda4af'; // rose-300
  }

  getHealthLabel(score: number): string {
    if (score >= 75) return 'Thriving';
    if (score >= 50) return 'Growing';
    return 'Needs care';
  }

  getHealthGradient(score: number): string {
    if (score >= 75) return 'linear-gradient(135deg, #bbf7d0, #dcfce7)'; // soft green
    if (score >= 50) return 'linear-gradient(135deg, #fde68a, #fef3c7)'; // soft amber
    return 'linear-gradient(135deg, #fecdd3, #ffe4e6)'; // soft rose
  }

  getEmoji(icon: string): string {
    return this.iconEmojis[icon] || '🌿';
  }
}
