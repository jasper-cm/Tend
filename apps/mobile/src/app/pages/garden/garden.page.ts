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
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { leafOutline, heartOutline, fitnessOutline, briefcaseOutline, bookOutline, peopleOutline, walletOutline, colorPaletteOutline } from 'ionicons/icons';
import { ApiService, LifeArea } from '../../services/api.service';

interface PlantData {
  lifeArea: LifeArea;
  height: number;
  color: string;
}

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
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>My Garden</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div class="loading-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p>Growing your garden...</p>
        </div>
      } @else {
        <!-- Garden Health Overview -->
        @if (averageHealth() > 0) {
          <ion-card class="health-card">
            <ion-card-content>
              <div class="health-display">
                <div class="health-score" [style.color]="getHealthColor(averageHealth())">
                  {{ averageHealth() }}
                </div>
                <div class="health-label">Garden Health</div>
              </div>
            </ion-card-content>
          </ion-card>
        }

        <!-- Garden Visualization -->
        <ion-card class="garden-card">
          <ion-card-content>
            <div class="garden-scene">
              <!-- Sky -->
              <div class="sky">
                <div class="cloud cloud-1"></div>
                <div class="cloud cloud-2"></div>
                <div class="sun"></div>
              </div>

              <!-- Plants Container -->
              <div class="plants-container">
                @for (plant of plants(); track plant.lifeArea.id) {
                  <div class="plant" [routerLink]="['/life-areas', plant.lifeArea.id]">
                    <div class="plant-visual">
                      <svg width="60" height="120" viewBox="0 0 60 120">
                        <!-- Stem -->
                        <path
                          [attr.d]="'M 30 120 Q 30 ' + (120 - plant.height/2) + ' 30 ' + (120 - plant.height)"
                          [attr.stroke]="plant.color"
                          stroke-width="3"
                          fill="none"
                        />
                        <!-- Leaves -->
                        @for (leaf of getLeaves(plant); track $index) {
                          <ellipse
                            [attr.cx]="leaf.x"
                            [attr.cy]="leaf.y"
                            rx="8"
                            ry="4"
                            [attr.fill]="plant.color"
                            [attr.transform]="'rotate(' + leaf.rotation + ' ' + leaf.x + ' ' + leaf.y + ')'"
                          />
                        }
                        <!-- Flower -->
                        @if (plant.lifeArea.healthScore >= 50) {
                          <circle
                            cx="30"
                            [attr.cy]="120 - plant.height - 5"
                            [attr.r]="plant.lifeArea.healthScore >= 75 ? 8 : 5"
                            [attr.fill]="plant.lifeArea.healthScore >= 75 ? '#ed87a8' : '#f5cd53'"
                          />
                          @if (plant.lifeArea.healthScore >= 75) {
                            <circle cx="30" [attr.cy]="120 - plant.height - 5" r="3" fill="#f5cd53"/>
                          }
                        }
                      </svg>
                      <div class="health-badge" [style.backgroundColor]="getHealthColor(plant.lifeArea.healthScore)">
                        {{ plant.lifeArea.healthScore }}
                      </div>
                    </div>
                    <div class="plant-name">{{ plant.lifeArea.name }}</div>
                    <div class="plant-status">{{ getHealthLabel(plant.lifeArea.healthScore) }}</div>
                  </div>
                }

                @if (plants().length === 0) {
                  <div class="empty-garden">
                    <p>Your garden is empty</p>
                    <p class="subtitle">Add life areas to start growing</p>
                  </div>
                }
              </div>

              <!-- Ground -->
              <div class="ground"></div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Stats Grid -->
        <ion-grid>
          <ion-row>
            <ion-col size="6">
              <ion-card class="stat-card">
                <ion-card-content>
                  <div class="stat-value">{{ plants().length }}</div>
                  <div class="stat-label">Life Areas</div>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="6">
              <ion-card class="stat-card">
                <ion-card-content>
                  <div class="stat-value thriving">{{ thrivingCount() }}</div>
                  <div class="stat-label">Thriving</div>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="6">
              <ion-card class="stat-card">
                <ion-card-content>
                  <div class="stat-value growing">{{ growingCount() }}</div>
                  <div class="stat-label">Growing</div>
                </ion-card-content>
              </ion-card>
            </ion-col>
            <ion-col size="6">
              <ion-card class="stat-card">
                <ion-card-content>
                  <div class="stat-value needs-care">{{ needsAttentionCount() }}</div>
                  <div class="stat-label">Needs Care</div>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Life Areas List -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Life Areas</ion-card-title>
          </ion-card-header>
          <ion-list>
            @for (plant of plants(); track plant.lifeArea.id) {
              <ion-item [routerLink]="['/life-areas', plant.lifeArea.id]" detail>
                <ion-icon [name]="getIcon(plant.lifeArea.icon)" slot="start" [style.color]="plant.color"></ion-icon>
                <ion-label>
                  <h2>{{ plant.lifeArea.name }}</h2>
                  <p>{{ plant.lifeArea.description }}</p>
                </ion-label>
                <ion-badge [color]="getHealthBadgeColor(plant.lifeArea.healthScore)" slot="end">
                  {{ plant.lifeArea.healthScore }}
                </ion-badge>
              </ion-item>
            }
          </ion-list>
        </ion-card>
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

    .health-card {
      --background: linear-gradient(135deg, #3d9a50 0%, #5fb56f 100%);
      color: white;
    }

    .health-display {
      text-align: center;
      padding: 16px;
    }

    .health-score {
      font-size: 48px;
      font-weight: bold;
      color: white !important;
    }

    .health-label {
      font-size: 14px;
      opacity: 0.9;
    }

    .garden-card {
      --background: transparent;
      margin: 0;
    }

    .garden-scene {
      position: relative;
      height: 250px;
      background: linear-gradient(to bottom, #e8f5e9 0%, #c8e6c9 100%);
      border-radius: 12px;
      overflow: hidden;
    }

    .sky {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 80px;
    }

    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
    }

    .cloud-1 {
      width: 60px;
      height: 30px;
      top: 15px;
      left: 20%;
    }

    .cloud-2 {
      width: 80px;
      height: 35px;
      top: 25px;
      right: 15%;
    }

    .sun {
      position: absolute;
      width: 40px;
      height: 40px;
      background: #f5cd53;
      border-radius: 50%;
      top: 10px;
      right: 20px;
      box-shadow: 0 0 20px rgba(245, 205, 83, 0.5);
    }

    .plants-container {
      position: absolute;
      bottom: 40px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      padding: 0 10px;
      overflow-x: auto;
      gap: 8px;
    }

    .plant {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      min-width: 70px;
    }

    .plant-visual {
      position: relative;
    }

    .health-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      color: white;
    }

    .plant-name {
      font-size: 11px;
      font-weight: 600;
      color: #46654c;
      text-align: center;
      max-width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .plant-status {
      font-size: 9px;
      color: #7a9d80;
    }

    .ground {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(to top, #5d4037 0%, #795548 100%);
      border-radius: 0 0 12px 12px;
    }

    .empty-garden {
      text-align: center;
      color: #46654c;
      padding: 40px;
    }

    .empty-garden .subtitle {
      font-size: 12px;
      opacity: 0.7;
    }

    .stat-card {
      text-align: center;
      margin: 4px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #3d9a50;
    }

    .stat-value.thriving {
      color: #3d9a50;
    }

    .stat-value.growing {
      color: #f2b82b;
    }

    .stat-value.needs-care {
      color: #e15f87;
    }

    .stat-label {
      font-size: 12px;
      color: var(--ion-color-medium);
    }
  `],
})
export class GardenPage implements OnInit {
  private api = inject(ApiService);

  plants = signal<PlantData[]>([]);
  loading = signal(true);
  averageHealth = signal(0);
  thrivingCount = signal(0);
  growingCount = signal(0);
  needsAttentionCount = signal(0);

  private plantColors = [
    '#3d9a50', '#5fb56f', '#46654c', '#7a9d80', '#5a7f61',
    '#266234', '#3d9a50', '#5fb56f', '#46654c', '#7a9d80',
  ];

  constructor() {
    addIcons({
      leafOutline,
      heartOutline,
      fitnessOutline,
      briefcaseOutline,
      bookOutline,
      peopleOutline,
      walletOutline,
      colorPaletteOutline,
    });
  }

  ngOnInit(): void {
    this.loadGarden();
  }

  handleRefresh(event: CustomEvent): void {
    this.loadGarden();
    setTimeout(() => {
      (event.target as HTMLIonRefresherElement).complete();
    }, 1000);
  }

  private loadGarden(): void {
    this.loading.set(true);
    this.api.getLifeAreas().subscribe({
      next: (lifeAreas) => {
        const plants = lifeAreas.map((la, index) => this.createPlant(la, index));
        this.plants.set(plants);

        if (lifeAreas.length > 0) {
          const avg = Math.round(
            lifeAreas.reduce((sum, la) => sum + la.healthScore, 0) / lifeAreas.length
          );
          this.averageHealth.set(avg);
        }

        this.thrivingCount.set(lifeAreas.filter(la => la.healthScore >= 75).length);
        this.growingCount.set(lifeAreas.filter(la => la.healthScore >= 50 && la.healthScore < 75).length);
        this.needsAttentionCount.set(lifeAreas.filter(la => la.healthScore < 50).length);

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private createPlant(lifeArea: LifeArea, index: number): PlantData {
    const healthFactor = lifeArea.healthScore / 100;
    const baseHeight = 30;
    const maxAdditionalHeight = 60;

    return {
      lifeArea,
      height: baseHeight + (healthFactor * maxAdditionalHeight),
      color: lifeArea.color || this.plantColors[index % this.plantColors.length],
    };
  }

  getLeaves(plant: PlantData): { x: number; y: number; rotation: number }[] {
    const leaves = [];
    const numLeaves = Math.floor(2 + (plant.lifeArea.healthScore / 100) * 4);

    for (let i = 0; i < numLeaves; i++) {
      const progress = (i + 1) / (numLeaves + 1);
      const y = 120 - (plant.height * progress);
      const side = i % 2 === 0 ? -1 : 1;

      leaves.push({
        x: 30 + (side * 10),
        y: y,
        rotation: side * 30,
      });
    }

    return leaves;
  }

  getHealthColor(score: number): string {
    if (score >= 75) return '#3d9a50';
    if (score >= 50) return '#f2b82b';
    return '#e15f87';
  }

  getHealthLabel(score: number): string {
    if (score >= 75) return 'Thriving';
    if (score >= 50) return 'Growing';
    return 'Needs care';
  }

  getHealthBadgeColor(score: number): string {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  }

  getIcon(icon: string): string {
    const iconMap: Record<string, string> = {
      leaf: 'leaf-outline',
      heart: 'heart-outline',
      brain: 'book-outline',
      briefcase: 'briefcase-outline',
      dumbbell: 'fitness-outline',
      book: 'book-outline',
      palette: 'color-palette-outline',
      users: 'people-outline',
      dollar: 'wallet-outline',
    };
    return iconMap[icon] || 'leaf-outline';
  }
}
