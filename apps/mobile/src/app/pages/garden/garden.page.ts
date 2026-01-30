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
  IonRippleEffect,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  leafOutline,
  heartOutline,
  fitnessOutline,
  briefcaseOutline,
  bookOutline,
  peopleOutline,
  walletOutline,
  colorPaletteOutline,
  sunnyOutline,
  sparklesOutline,
  trendingUpOutline,
  alertCircleOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { ApiService, LifeArea } from '../../services/api.service';

interface PlantData {
  lifeArea: LifeArea;
  height: number;
  color: string;
  animationDelay: number;
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
    IonRippleEffect,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>
          <span class="header-title">
            <span class="header-icon">🌿</span>
            My Garden
          </span>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (loading()) {
        <div class="loading-container">
          <div class="loading-animation">
            <div class="loading-leaf"></div>
          </div>
          <p class="loading-text">Growing your garden...</p>
        </div>
      } @else {
        <!-- Hero Health Card -->
        <div class="hero-section">
          <div class="hero-bg"></div>
          <div class="hero-content">
            <div class="greeting">{{ getGreeting() }}</div>
            <h1 class="hero-title">Your Garden Overview</h1>

            <div class="health-ring-container">
              <svg viewBox="0 0 140 140" class="health-ring">
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" [attr.stop-color]="getHealthColor(averageHealth())" />
                    <stop offset="100%" [attr.stop-color]="getHealthColorDark(averageHealth())" />
                  </linearGradient>
                </defs>
                <circle
                  class="health-ring-bg"
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  stroke-width="10"
                />
                <circle
                  class="health-ring-fill"
                  cx="70"
                  cy="70"
                  r="60"
                  fill="none"
                  stroke="url(#healthGradient)"
                  stroke-width="10"
                  stroke-linecap="round"
                  [style.strokeDasharray]="getCircumference()"
                  [style.strokeDashoffset]="getHealthOffset()"
                />
              </svg>
              <div class="health-value">
                <span class="health-number">{{ averageHealth() }}</span>
                <span class="health-label">Overall Health</span>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="quick-stats">
              <div class="quick-stat">
                <ion-icon name="sparkles-outline" color="success"></ion-icon>
                <span class="stat-num">{{ thrivingCount() }}</span>
                <span class="stat-text">Thriving</span>
              </div>
              <div class="quick-stat">
                <ion-icon name="trending-up-outline" color="warning"></ion-icon>
                <span class="stat-num">{{ growingCount() }}</span>
                <span class="stat-text">Growing</span>
              </div>
              <div class="quick-stat">
                <ion-icon name="alert-circle-outline" color="danger"></ion-icon>
                <span class="stat-num">{{ needsAttentionCount() }}</span>
                <span class="stat-text">Needs Care</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Garden Visualization -->
        <div class="garden-visualization">
          <div class="garden-scene">
            <!-- Animated Sky -->
            <div class="sky">
              <div class="cloud cloud-1"></div>
              <div class="cloud cloud-2"></div>
              <div class="cloud cloud-3"></div>
              <div class="sun">
                <div class="sun-rays"></div>
              </div>
            </div>

            <!-- Plants Container -->
            <div class="plants-container">
              @for (plant of plants(); track plant.lifeArea.id) {
                <div
                  class="plant"
                  [routerLink]="['/life-areas', plant.lifeArea.id]"
                  [style.animationDelay]="plant.animationDelay + 'ms'"
                >
                  <div class="plant-visual">
                    <svg width="70" height="130" viewBox="0 0 70 130" class="plant-svg">
                      <!-- Pot -->
                      <path
                        d="M 20 125 L 25 105 L 45 105 L 50 125 Z"
                        fill="#8D6E63"
                        class="pot"
                      />
                      <ellipse cx="35" cy="105" rx="12" ry="3" fill="#A1887F" />

                      <!-- Stem -->
                      <path
                        [attr.d]="getStemPath(plant)"
                        [attr.stroke]="plant.color"
                        stroke-width="4"
                        fill="none"
                        stroke-linecap="round"
                        class="stem"
                      />

                      <!-- Leaves -->
                      @for (leaf of getLeaves(plant); track $index) {
                        <ellipse
                          [attr.cx]="leaf.x"
                          [attr.cy]="leaf.y"
                          [attr.rx]="leaf.size"
                          [attr.ry]="leaf.size * 0.5"
                          [attr.fill]="plant.color"
                          [attr.transform]="'rotate(' + leaf.rotation + ' ' + leaf.x + ' ' + leaf.y + ')'"
                          class="leaf"
                          [style.animationDelay]="(leaf.index * 100) + 'ms'"
                        />
                      }

                      <!-- Flower/Bloom -->
                      @if (plant.lifeArea.healthScore >= 40) {
                        <g class="flower" [attr.transform]="'translate(35, ' + (105 - plant.height - 8) + ')'">
                          @if (plant.lifeArea.healthScore >= 75) {
                            <!-- Full bloom -->
                            @for (petal of [0, 60, 120, 180, 240, 300]; track petal) {
                              <ellipse
                                cx="0"
                                cy="-8"
                                rx="5"
                                ry="9"
                                fill="#ed87a8"
                                [attr.transform]="'rotate(' + petal + ')'"
                                class="petal"
                              />
                            }
                            <circle cx="0" cy="0" r="5" fill="#f5cd53" />
                          } @else if (plant.lifeArea.healthScore >= 50) {
                            <!-- Budding -->
                            <ellipse cx="0" cy="-4" rx="4" ry="6" fill="#f5cd53" />
                            <ellipse cx="-3" cy="-2" rx="3" ry="5" fill="#9CCC65" />
                            <ellipse cx="3" cy="-2" rx="3" ry="5" fill="#9CCC65" />
                          } @else {
                            <!-- Small bud -->
                            <ellipse cx="0" cy="-2" rx="3" ry="4" fill="#AED581" />
                          }
                        </g>
                      }
                    </svg>

                    <div class="health-indicator" [style.backgroundColor]="getHealthColor(plant.lifeArea.healthScore)">
                      {{ plant.lifeArea.healthScore }}
                    </div>
                  </div>
                  <div class="plant-info">
                    <span class="plant-name">{{ plant.lifeArea.name }}</span>
                    <span class="plant-status" [style.color]="getHealthColor(plant.lifeArea.healthScore)">
                      {{ getHealthLabel(plant.lifeArea.healthScore) }}
                    </span>
                  </div>
                </div>
              }

              @if (plants().length === 0) {
                <div class="empty-garden">
                  <div class="empty-icon">🌱</div>
                  <p class="empty-title">Your garden awaits</p>
                  <p class="empty-subtitle">Plant your first life area to begin your journey</p>
                </div>
              }
            </div>

            <!-- Animated Ground -->
            <div class="ground">
              <div class="grass"></div>
              <div class="soil"></div>
            </div>
          </div>
        </div>

        <!-- Life Areas List -->
        <div class="section-header">
          <h2 class="section-title">Life Areas</h2>
          <span class="section-count">{{ plants().length }} areas</span>
        </div>

        <div class="life-areas-list">
          @for (plant of plants(); track plant.lifeArea.id; let i = $index) {
            <div
              class="life-area-card ion-activatable"
              [routerLink]="['/life-areas', plant.lifeArea.id]"
              [style.animationDelay]="(i * 50) + 'ms'"
            >
              <ion-ripple-effect></ion-ripple-effect>

              <div class="card-icon" [style.background]="getIconGradient(plant.color)">
                {{ getEmoji(plant.lifeArea.icon) }}
              </div>

              <div class="card-content">
                <h3 class="card-title">{{ plant.lifeArea.name }}</h3>
                <p class="card-description">{{ plant.lifeArea.description }}</p>

                <div class="health-bar-container">
                  <div class="health-bar">
                    <div
                      class="health-bar-fill"
                      [style.width]="plant.lifeArea.healthScore + '%'"
                      [style.background]="getHealthGradient(plant.lifeArea.healthScore)"
                    ></div>
                  </div>
                  <span class="health-text" [style.color]="getHealthColor(plant.lifeArea.healthScore)">
                    {{ plant.lifeArea.healthScore }}%
                  </span>
                </div>
              </div>

              <ion-icon name="chevron-forward-outline" class="card-arrow"></ion-icon>
            </div>
          }
        </div>
      }
    </ion-content>
  `,
  styles: [`
    /* Header */
    ion-toolbar {
      --background: transparent;
      --border-width: 0;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 20px;
      color: #31261f;
    }

    .header-icon {
      font-size: 24px;
    }

    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
    }

    .loading-animation {
      width: 80px;
      height: 80px;
      position: relative;
    }

    .loading-leaf {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3d9a50 0%, #5fb56f 100%);
      border-radius: 50% 0 50% 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: leafSpin 1.5s ease-in-out infinite;
    }

    @keyframes leafSpin {
      0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
      50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.1); }
    }

    .loading-text {
      margin-top: 16px;
      color: #7a9d80;
      font-size: 14px;
      font-weight: 500;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      padding: 24px 20px 32px;
      margin-bottom: 8px;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #3d9a50 0%, #266234 100%);
      border-radius: 0 0 32px 32px;
    }

    .hero-bg::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 80%;
      height: 150%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
    }

    .hero-content {
      position: relative;
      z-index: 1;
      color: white;
    }

    .greeting {
      font-size: 13px;
      opacity: 0.85;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .hero-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 24px 0;
      letter-spacing: -0.02em;
    }

    .health-ring-container {
      position: relative;
      width: 140px;
      height: 140px;
      margin: 0 auto 24px;
    }

    .health-ring {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .health-ring-fill {
      transition: stroke-dashoffset 1s ease-out;
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
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
    }

    .health-label {
      display: block;
      font-size: 11px;
      opacity: 0.8;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .quick-stats {
      display: flex;
      justify-content: space-around;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 16px;
    }

    .quick-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .quick-stat ion-icon {
      font-size: 20px;
      opacity: 0.9;
    }

    .stat-num {
      font-size: 20px;
      font-weight: 700;
    }

    .stat-text {
      font-size: 10px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    /* Garden Visualization */
    .garden-visualization {
      padding: 0 16px;
      margin-bottom: 24px;
    }

    .garden-scene {
      position: relative;
      height: 280px;
      background: linear-gradient(180deg, #e3f2fd 0%, #c8e6c9 50%, #a5d6a7 100%);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(61, 154, 80, 0.15);
    }

    .sky {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100px;
    }

    .cloud {
      position: absolute;
      background: white;
      border-radius: 50px;
      opacity: 0.8;
      animation: cloudFloat 20s ease-in-out infinite;
    }

    .cloud::before,
    .cloud::after {
      content: '';
      position: absolute;
      background: white;
      border-radius: 50%;
    }

    .cloud-1 {
      width: 50px;
      height: 20px;
      top: 20px;
      left: 10%;
      animation-delay: 0s;
    }
    .cloud-1::before { width: 25px; height: 25px; top: -12px; left: 8px; }
    .cloud-1::after { width: 20px; height: 20px; top: -8px; left: 25px; }

    .cloud-2 {
      width: 60px;
      height: 22px;
      top: 35px;
      right: 20%;
      animation-delay: -7s;
    }
    .cloud-2::before { width: 30px; height: 30px; top: -15px; left: 10px; }
    .cloud-2::after { width: 25px; height: 25px; top: -10px; left: 30px; }

    .cloud-3 {
      width: 40px;
      height: 16px;
      top: 15px;
      right: 10%;
      animation-delay: -14s;
    }
    .cloud-3::before { width: 20px; height: 20px; top: -10px; left: 5px; }
    .cloud-3::after { width: 15px; height: 15px; top: -6px; left: 18px; }

    @keyframes cloudFloat {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(20px); }
    }

    .sun {
      position: absolute;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #fff59d 0%, #ffee58 100%);
      border-radius: 50%;
      top: 15px;
      right: 25px;
      box-shadow: 0 0 40px rgba(255, 238, 88, 0.6);
      animation: sunPulse 4s ease-in-out infinite;
    }

    .sun-rays {
      position: absolute;
      inset: -10px;
      background: radial-gradient(circle, rgba(255, 238, 88, 0.3) 0%, transparent 70%);
      animation: raysPulse 4s ease-in-out infinite;
    }

    @keyframes sunPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes raysPulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }

    .plants-container {
      position: absolute;
      bottom: 50px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 4px;
      padding: 0 8px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .plants-container::-webkit-scrollbar {
      display: none;
    }

    .plant {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      min-width: 75px;
      animation: plantAppear 0.6s ease-out backwards;
      transition: transform 0.2s ease;
    }

    .plant:active {
      transform: scale(0.95);
    }

    @keyframes plantAppear {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .plant-visual {
      position: relative;
    }

    .plant-svg {
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
    }

    .stem {
      animation: stemSway 3s ease-in-out infinite;
    }

    @keyframes stemSway {
      0%, 100% { transform: rotate(0deg); transform-origin: bottom center; }
      50% { transform: rotate(1deg); transform-origin: bottom center; }
    }

    .leaf {
      animation: leafSway 2.5s ease-in-out infinite backwards;
    }

    @keyframes leafSway {
      0%, 100% { transform: rotate(0deg) scale(1); }
      50% { transform: rotate(3deg) scale(1.02); }
    }

    .flower {
      animation: flowerBreathe 3s ease-in-out infinite;
    }

    @keyframes flowerBreathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .petal {
      animation: petalWave 2s ease-in-out infinite;
    }

    @keyframes petalWave {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.9; }
    }

    .health-indicator {
      position: absolute;
      top: 0;
      right: 0;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      border: 2px solid white;
    }

    .plant-info {
      text-align: center;
      margin-top: 4px;
    }

    .plant-name {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #31261f;
      max-width: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .plant-status {
      display: block;
      font-size: 9px;
      font-weight: 500;
      margin-top: 1px;
    }

    .ground {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50px;
    }

    .grass {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 15px;
      background: linear-gradient(180deg, #7cb342 0%, #689f38 100%);
      border-radius: 100% 100% 0 0 / 100% 100% 0 0;
    }

    .soil {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(180deg, #6d4c41 0%, #5d4037 100%);
      border-radius: 0 0 24px 24px;
    }

    .empty-garden {
      text-align: center;
      padding: 40px 20px;
      color: #31261f;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
      animation: seedBounce 2s ease-in-out infinite;
    }

    @keyframes seedBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .empty-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px;
    }

    .empty-subtitle {
      font-size: 14px;
      color: #7a9d80;
      margin: 0;
    }

    /* Section Header */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px 12px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #31261f;
      margin: 0;
    }

    .section-count {
      font-size: 13px;
      color: #7a9d80;
      font-weight: 500;
    }

    /* Life Areas List */
    .life-areas-list {
      padding: 0 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .life-area-card {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(61, 154, 80, 0.08);
      border: 1px solid rgba(61, 154, 80, 0.1);
      cursor: pointer;
      overflow: hidden;
      animation: cardAppear 0.5s ease-out backwards;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .life-area-card:active {
      transform: scale(0.98);
    }

    @keyframes cardAppear {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card-icon {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-content {
      flex: 1;
      min-width: 0;
    }

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #31261f;
      margin: 0 0 4px;
    }

    .card-description {
      font-size: 13px;
      color: #7a9d80;
      margin: 0 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .health-bar-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .health-bar {
      flex: 1;
      height: 6px;
      background: rgba(122, 157, 128, 0.2);
      border-radius: 3px;
      overflow: hidden;
    }

    .health-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.8s ease-out;
    }

    .health-text {
      font-size: 13px;
      font-weight: 600;
      min-width: 36px;
      text-align: right;
    }

    .card-arrow {
      color: #c5d8c7;
      font-size: 20px;
      flex-shrink: 0;
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

  private iconEmojis: Record<string, string> = {
    leaf: '🌿',
    heart: '❤️',
    brain: '🧠',
    briefcase: '💼',
    dumbbell: '💪',
    book: '📚',
    palette: '🎨',
    users: '👥',
    dollar: '💰',
  };

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
      sunnyOutline,
      sparklesOutline,
      trendingUpOutline,
      alertCircleOutline,
      chevronForwardOutline,
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
    const baseHeight = 25;
    const maxAdditionalHeight = 50;

    return {
      lifeArea,
      height: baseHeight + (healthFactor * maxAdditionalHeight),
      color: lifeArea.color || this.getDefaultColor(index),
      animationDelay: index * 100,
    };
  }

  private getDefaultColor(index: number): string {
    const colors = ['#3d9a50', '#5fb56f', '#46654c', '#7a9d80', '#5a7f61', '#266234'];
    return colors[index % colors.length];
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getCircumference(): string {
    return `${2 * Math.PI * 60}`;
  }

  getHealthOffset(): string {
    const circumference = 2 * Math.PI * 60;
    const health = this.averageHealth();
    const offset = circumference - (health / 100) * circumference;
    return `${offset}`;
  }

  getStemPath(plant: PlantData): string {
    const startY = 105;
    const endY = startY - plant.height;
    const midY = startY - plant.height / 2;
    const curve = Math.sin(plant.animationDelay / 500) * 3;
    return `M 35 ${startY} Q ${35 + curve} ${midY} 35 ${endY}`;
  }

  getLeaves(plant: PlantData): { x: number; y: number; size: number; rotation: number; index: number }[] {
    const leaves = [];
    const numLeaves = Math.floor(2 + (plant.lifeArea.healthScore / 100) * 4);
    const startY = 105;

    for (let i = 0; i < numLeaves; i++) {
      const progress = (i + 1) / (numLeaves + 1);
      const y = startY - (plant.height * progress);
      const side = i % 2 === 0 ? -1 : 1;
      const size = 6 + (plant.lifeArea.healthScore / 100) * 4;

      leaves.push({
        x: 35 + (side * 12),
        y: y,
        size: size,
        rotation: side * (25 + Math.random() * 10),
        index: i,
      });
    }

    return leaves;
  }

  getHealthColor(score: number): string {
    if (score >= 75) return '#3d9a50';
    if (score >= 50) return '#f2b82b';
    return '#e15f87';
  }

  getHealthColorDark(score: number): string {
    if (score >= 75) return '#266234';
    if (score >= 50) return '#d4a21a';
    return '#c43d65';
  }

  getHealthLabel(score: number): string {
    if (score >= 75) return 'Thriving';
    if (score >= 50) return 'Growing';
    return 'Needs care';
  }

  getHealthGradient(score: number): string {
    const color = this.getHealthColor(score);
    const colorDark = this.getHealthColorDark(score);
    return `linear-gradient(90deg, ${color} 0%, ${colorDark} 100%)`;
  }

  getIconGradient(color: string): string {
    return `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`;
  }

  getEmoji(icon: string): string {
    return this.iconEmojis[icon] || '🌿';
  }
}
