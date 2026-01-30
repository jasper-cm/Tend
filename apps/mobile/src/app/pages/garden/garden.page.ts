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
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
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
          <ion-spinner name="crescent" color="primary" style="width: 48px; height: 48px;"></ion-spinner>
          <p style="margin-top: 16px; color: var(--ion-color-medium);">Growing your garden...</p>
        </div>
      } @else {
        <!-- Welcome Card -->
        <ion-card color="primary">
          <ion-card-header>
            <ion-card-subtitle>{{ getGreeting() }}</ion-card-subtitle>
            <ion-card-title style="font-size: 24px;">Your Life Garden</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p style="margin-bottom: 16px; opacity: 0.9;">
              Nurture every dimension of your life. Each area is a plot in your personal garden.
            </p>
            @if (lifeAreas().length > 0) {
              <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: bold;">{{ averageHealth() }}</div>
                  <div style="font-size: 12px; opacity: 0.8;">Overall Health</div>
                </div>
                <div style="text-align: center;">
                  <div style="font-size: 32px; font-weight: bold;">{{ lifeAreas().length }}</div>
                  <div style="font-size: 12px; opacity: 0.8;">Life Areas</div>
                </div>
              </div>
            }
          </ion-card-content>
        </ion-card>

        @if (lifeAreas().length > 0) {
          <!-- Stats Cards -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
            <ion-card style="margin: 0;">
              <ion-card-content style="text-align: center; padding: 12px;">
                <ion-icon name="sparkles-outline" color="success" style="font-size: 24px;"></ion-icon>
                <div style="font-size: 24px; font-weight: bold; color: var(--ion-color-success);">{{ thrivingCount() }}</div>
                <div style="font-size: 11px; color: var(--ion-color-medium);">Thriving</div>
              </ion-card-content>
            </ion-card>
            <ion-card style="margin: 0;">
              <ion-card-content style="text-align: center; padding: 12px;">
                <ion-icon name="trending-up-outline" color="warning" style="font-size: 24px;"></ion-icon>
                <div style="font-size: 24px; font-weight: bold; color: var(--ion-color-warning);">{{ growingCount() }}</div>
                <div style="font-size: 11px; color: var(--ion-color-medium);">Growing</div>
              </ion-card-content>
            </ion-card>
            <ion-card style="margin: 0;">
              <ion-card-content style="text-align: center; padding: 12px;">
                <ion-icon name="alert-circle-outline" color="danger" style="font-size: 24px;"></ion-icon>
                <div style="font-size: 24px; font-weight: bold; color: var(--ion-color-danger);">{{ needsCareCount() }}</div>
                <div style="font-size: 11px; color: var(--ion-color-medium);">Needs Care</div>
              </ion-card-content>
            </ion-card>
          </div>

          <!-- Life Areas Section -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>Life Areas</ion-card-title>
              <ion-card-subtitle>Tap an area to see details</ion-card-subtitle>
            </ion-card-header>
            <ion-list>
              @for (area of lifeAreas(); track area.id) {
                <ion-item [routerLink]="['/life-areas', area.id]" detail="true" button>
                  <ion-avatar slot="start" [style.background]="getHealthGradient(area.healthScore)">
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                      {{ getEmoji(area.icon) }}
                    </div>
                  </ion-avatar>
                  <ion-label>
                    <h2 style="font-weight: 600;">{{ area.name }}</h2>
                    <p>{{ area.description }}</p>
                    <ion-progress-bar
                      [value]="area.healthScore / 100"
                      [color]="getHealthColor(area.healthScore)"
                      style="margin-top: 8px; height: 6px; border-radius: 3px;"
                    ></ion-progress-bar>
                  </ion-label>
                  <ion-badge slot="end" [color]="getHealthColor(area.healthScore)">
                    {{ area.healthScore }}%
                  </ion-badge>
                </ion-item>
              }
            </ion-list>
          </ion-card>

          <!-- Quick Actions -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>Quick Actions</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <ion-button routerLink="/practices" expand="block" fill="outline">
                  <ion-icon name="fitness-outline" slot="start"></ion-icon>
                  Log Practice
                </ion-button>
                <ion-button routerLink="/reflections" expand="block" fill="outline">
                  <ion-icon name="book-outline" slot="start"></ion-icon>
                  Write Reflection
                </ion-button>
                <ion-button routerLink="/guide" expand="block" fill="outline">
                  <ion-icon name="sparkles-outline" slot="start"></ion-icon>
                  Ask Guide
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        } @else {
          <!-- Empty State -->
          <ion-card>
            <ion-card-content style="text-align: center; padding: 40px 20px;">
              <div style="font-size: 64px; margin-bottom: 16px;">🌱</div>
              <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 8px 0; color: var(--ion-color-dark);">
                No Life Areas Yet
              </h2>
              <p style="color: var(--ion-color-medium); margin: 0 0 24px 0;">
                Start building your garden by adding life areas to tend.<br>
                Each area represents a dimension of your life you want to nurture.
              </p>
              <ion-button expand="block" color="primary" size="large">
                <ion-icon name="add-outline" slot="start"></ion-icon>
                Add Your First Life Area
              </ion-button>
            </ion-card-content>
          </ion-card>

          <!-- Suggested Life Areas -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>Suggested Life Areas</ion-card-title>
              <ion-card-subtitle>Common areas people tend</ion-card-subtitle>
            </ion-card-header>
            <ion-list>
              @for (suggestion of suggestedAreas; track suggestion.name) {
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

          <!-- Tips Card -->
          <ion-card color="light">
            <ion-card-header>
              <ion-card-title>
                <ion-icon name="sunny-outline" style="margin-right: 8px; vertical-align: middle;"></ion-icon>
                Getting Started Tips
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list lines="none" style="background: transparent;">
                <ion-item style="--background: transparent;">
                  <ion-icon name="leaf-outline" slot="start" color="primary"></ion-icon>
                  <ion-label class="ion-text-wrap">
                    <p><strong>Start Small</strong> - Begin with 2-3 life areas you want to focus on</p>
                  </ion-label>
                </ion-item>
                <ion-item style="--background: transparent;">
                  <ion-icon name="water-outline" slot="start" color="primary"></ion-icon>
                  <ion-label class="ion-text-wrap">
                    <p><strong>Be Consistent</strong> - Regular small actions grow healthy habits</p>
                  </ion-label>
                </ion-item>
                <ion-item style="--background: transparent;">
                  <ion-icon name="ribbon-outline" slot="start" color="primary"></ion-icon>
                  <ion-label class="ion-text-wrap">
                    <p><strong>Celebrate Progress</strong> - Every step forward matters</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        }
      }

      <!-- FAB for adding new life area -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button color="primary">
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
    { name: 'Health & Fitness', emoji: '💪', description: 'Physical wellbeing and exercise', gradient: 'linear-gradient(135deg, #4CAF50, #8BC34A)' },
    { name: 'Career & Work', emoji: '💼', description: 'Professional growth and goals', gradient: 'linear-gradient(135deg, #2196F3, #03A9F4)' },
    { name: 'Relationships', emoji: '❤️', description: 'Family, friends, and connections', gradient: 'linear-gradient(135deg, #E91E63, #F48FB1)' },
    { name: 'Personal Growth', emoji: '🧠', description: 'Learning and self-improvement', gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)' },
    { name: 'Finances', emoji: '💰', description: 'Money management and savings', gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
    { name: 'Creativity', emoji: '🎨', description: 'Art, hobbies, and expression', gradient: 'linear-gradient(135deg, #00BCD4, #4DD0E1)' },
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
      peopleOutline, walletOutline, colorPaletteOutline, ribbonOutline,
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

  getHealthGradient(score: number): string {
    if (score >= 75) return 'linear-gradient(135deg, #4CAF50, #8BC34A)';
    if (score >= 50) return 'linear-gradient(135deg, #FF9800, #FFB74D)';
    return 'linear-gradient(135deg, #f44336, #E57373)';
  }

  getEmoji(icon: string): string {
    return this.iconEmojis[icon] || '🌿';
  }
}
