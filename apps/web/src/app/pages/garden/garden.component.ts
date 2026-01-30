import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, LifeArea } from '../../services/api.service';

interface PlantData {
  lifeArea: LifeArea;
  plantType: string;
  height: number;
  color: string;
  leaves: number;
  flowers: number;
  position: number;
}

@Component({
  selector: 'tend-garden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Hero Welcome Section -->
      <div class="bg-gradient-to-br from-spirit-500 via-spirit-600 to-spirit-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-lg">
        <!-- Decorative elements -->
        <div class="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
        <div class="absolute -bottom-12 -left-12 w-36 h-36 bg-white/5 rounded-full blur-lg"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-white/80 text-sm mb-1">{{ getGreeting() }}</p>
              <h1 class="text-3xl lg:text-4xl font-bold mb-2">Your Life Garden</h1>
              <p class="text-white/90 max-w-lg">
                Nurture every dimension of your life. Each area is a plot in your personal garden, waiting to flourish.
              </p>
            </div>

            @if (averageHealth() > 0) {
              <!-- Health Ring -->
              <div class="hidden md:flex flex-col items-center">
                <div class="relative w-24 h-24">
                  <svg class="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" stroke-width="8" fill="none"/>
                    <circle
                      cx="48" cy="48" r="40"
                      stroke="white"
                      stroke-width="8"
                      fill="none"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="251.2"
                      [attr.stroke-dashoffset]="251.2 - (251.2 * averageHealth() / 100)"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-2xl font-bold">{{ averageHealth() }}</span>
                  </div>
                </div>
                <span class="text-sm text-white/80 mt-2">Garden Health</span>
              </div>
            }
          </div>

          <!-- Quick Stats -->
          @if (plants().length > 0) {
            <div class="flex gap-8 mt-6">
              <div>
                <span class="text-3xl font-bold">{{ plants().length }}</span>
                <span class="text-white/70 text-sm block">Life Areas</span>
              </div>
              <div>
                <span class="text-3xl font-bold">{{ thrivingCount() }}</span>
                <span class="text-white/70 text-sm block">Thriving</span>
              </div>
              <div class="md:hidden">
                <span class="text-3xl font-bold">{{ averageHealth() }}%</span>
                <span class="text-white/70 text-sm block">Health</span>
              </div>
            </div>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-16">
          <div class="w-16 h-16 bg-spirit-100 rounded-full flex items-center justify-center animate-pulse mb-4">
            <span class="text-3xl">🌱</span>
          </div>
          <p class="text-sage-600">Growing your garden...</p>
        </div>
      } @else {
        <!-- Garden Stats Cards -->
        @if (plants().length > 0) {
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-spirit-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">🌿</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Life Areas</span>
              </div>
              <div class="text-3xl font-bold text-spirit-600">{{ plants().length }}</div>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">✨</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Thriving</span>
              </div>
              <div class="text-3xl font-bold text-green-600">{{ thrivingCount() }}</div>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">📈</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Growing</span>
              </div>
              <div class="text-3xl font-bold text-amber-500">{{ growingCount() }}</div>
            </div>

            <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">💧</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Needs Care</span>
              </div>
              <div class="text-3xl font-bold text-rose-500">{{ needsAttentionCount() }}</div>
            </div>
          </div>
        }

        <!-- Side-scrolling Garden Visualization -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-800">Garden Visualization</h2>
            <p class="text-sm text-gray-500">Watch your life areas grow as you tend them</p>
          </div>

          <div class="relative bg-gradient-spirit overflow-hidden" style="height: 320px;">
            <!-- Sky with clouds -->
            <div class="absolute inset-0 overflow-hidden">
              <div class="absolute top-4 left-[10%] w-16 h-8 bg-white/60 rounded-full blur-sm"></div>
              <div class="absolute top-8 left-[15%] w-12 h-6 bg-white/40 rounded-full blur-sm"></div>
              <div class="absolute top-6 right-[20%] w-20 h-10 bg-white/50 rounded-full blur-sm"></div>
              <div class="absolute top-10 right-[25%] w-14 h-7 bg-white/30 rounded-full blur-sm"></div>
            </div>

            <!-- Sun -->
            <div class="absolute top-4 right-8 w-16 h-16 bg-golden-400 rounded-full shadow-glow"></div>

            <!-- Ground -->
            <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-earth-700 to-earth-500"></div>
            <div class="absolute bottom-20 left-0 right-0 h-8 bg-gradient-to-t from-earth-500/80 to-transparent"></div>

            <!-- Grass line -->
            <div class="absolute bottom-20 left-0 right-0 h-4 bg-gradient-to-t from-spirit-700 to-spirit-500 opacity-80"></div>

            <!-- Scrollable garden container -->
            <div class="absolute bottom-24 left-0 right-0 h-48 overflow-x-auto overflow-y-hidden scrollbar-thin">
              <div class="flex items-end h-full px-8 gap-8" [style.minWidth.px]="plants().length * 140 + 100">
                @for (plant of plants(); track plant.lifeArea.id; let i = $index) {
                  <a
                    [routerLink]="['/life-areas', plant.lifeArea.id]"
                    class="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                    [style.marginLeft.px]="i === 0 ? 20 : 0"
                  >
                    <!-- Plant SVG -->
                    <div class="relative" [style.height.px]="plant.height + 40">
                      <svg [attr.width]="80" [attr.height]="plant.height + 40" viewBox="0 0 80 200" class="drop-shadow-md">
                        <path [attr.d]="getStemPath(plant)" [attr.stroke]="plant.color" stroke-width="4" fill="none" stroke-linecap="round"/>
                        @for (leaf of getLeaves(plant); track $index) {
                          <ellipse [attr.cx]="leaf.x" [attr.cy]="leaf.y" [attr.rx]="leaf.rx" [attr.ry]="leaf.ry" [attr.fill]="leaf.color" [attr.transform]="'rotate(' + leaf.rotation + ' ' + leaf.x + ' ' + leaf.y + ')'" class="transition-all duration-300"/>
                        }
                        @for (flower of getFlowers(plant); track $index) {
                          <circle [attr.cx]="flower.x" [attr.cy]="flower.y" [attr.r]="flower.r" [attr.fill]="flower.color" class="transition-all duration-300"/>
                          @if (flower.hasCenter) {
                            <circle [attr.cx]="flower.x" [attr.cy]="flower.y" [attr.r]="flower.r * 0.4" fill="#f5cd53"/>
                          }
                        }
                      </svg>
                      <div class="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity" [style.backgroundColor]="getHealthColor(plant.lifeArea.healthScore)">
                        {{ plant.lifeArea.healthScore }}
                      </div>
                    </div>
                    <div class="mt-2 text-center">
                      <div class="text-sm font-medium text-earth-800 group-hover:text-spirit-600 transition-colors">{{ plant.lifeArea.name }}</div>
                      <div class="text-xs text-earth-500">{{ getHealthLabel(plant.lifeArea.healthScore) }}</div>
                    </div>
                  </a>
                }

                @if (plants().length === 0) {
                  <div class="flex items-center justify-center w-full h-full">
                    <div class="text-center text-earth-600">
                      <p class="text-lg">Your garden is empty</p>
                      <p class="text-sm mt-1">Add life areas to start growing</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            @if (plants().length > 4) {
              <div class="absolute bottom-2 right-4 text-xs text-earth-500/60 flex items-center gap-1">
                <span>Scroll to explore</span>
                <span>&rarr;</span>
              </div>
            }
          </div>
        </div>

        <!-- Life Areas List -->
        @if (plants().length > 0) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-800">Life Areas</h2>
                <p class="text-sm text-gray-500">Tap an area to see details and tend it</p>
              </div>
              <a routerLink="/life-areas" class="text-sm text-spirit-600 hover:text-spirit-700 font-medium">
                Manage all &rarr;
              </a>
            </div>

            <div class="divide-y divide-gray-100">
              @for (plant of plants(); track plant.lifeArea.id) {
                <a [routerLink]="['/life-areas', plant.lifeArea.id]" class="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" [style.background]="getHealthGradient(plant.lifeArea.healthScore)">
                    {{ getEmoji(plant.lifeArea.icon) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-800">{{ plant.lifeArea.name }}</h3>
                    <p class="text-sm text-gray-500 truncate">{{ plant.lifeArea.description }}</p>
                    <div class="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-500" [style.width.%]="plant.lifeArea.healthScore" [style.background]="getHealthColor(plant.lifeArea.healthScore)"></div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-xl font-bold" [style.color]="getHealthColor(plant.lifeArea.healthScore)">{{ plant.lifeArea.healthScore }}%</div>
                    <div class="text-xs text-gray-500">{{ getHealthLabel(plant.lifeArea.healthScore) }}</div>
                  </div>
                </a>
              }
            </div>
          </div>
        }

        <!-- Quick Actions Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a routerLink="/practices" class="flex items-center gap-3 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors group">
              <div class="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="text-xl">💪</span>
              </div>
              <div>
                <div class="font-medium text-gray-800">Log Practice</div>
                <div class="text-sm text-gray-500">Track your habits</div>
              </div>
            </a>
            <a routerLink="/reflections" class="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group">
              <div class="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="text-xl">📝</span>
              </div>
              <div>
                <div class="font-medium text-gray-800">Write Reflection</div>
                <div class="text-sm text-gray-500">Journal your thoughts</div>
              </div>
            </a>
            <a routerLink="/garden-guide" class="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group">
              <div class="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span class="text-xl">✨</span>
              </div>
              <div>
                <div class="font-medium text-gray-800">Ask Guide</div>
                <div class="text-sm text-gray-500">Get AI coaching</div>
              </div>
            </a>
          </div>
        </div>

        <!-- Empty State -->
        @if (plants().length === 0) {
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div class="w-20 h-20 bg-spirit-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-4xl">🌱</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Start Your Garden</h3>
            <p class="text-gray-500 mb-6 max-w-md mx-auto">
              Your life garden is ready to grow. Add life areas to begin nurturing different dimensions of your life.
            </p>
            <a routerLink="/life-areas" class="inline-flex items-center gap-2 px-6 py-3 bg-spirit-500 text-white rounded-xl hover:bg-spirit-600 transition-colors font-medium shadow-sm">
              <span>Add Your First Life Area</span>
              <span>&rarr;</span>
            </a>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .scrollbar-thin::-webkit-scrollbar {
      height: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: #f8f6f1;
      border-radius: 3px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #a3bda7;
      border-radius: 3px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #5a7f61;
    }
  `],
})
export class GardenComponent implements OnInit {
  private api = inject(ApiService);

  plants = signal<PlantData[]>([]);
  loading = signal(true);
  averageHealth = signal(0);
  thrivingCount = signal(0);
  growingCount = signal(0);
  needsAttentionCount = signal(0);

  // Updated to use spiritual green palette
  private plantColors = [
    '#3d9a50', '#5fb56f', '#46654c', '#7a9d80', '#5a7f61',
    '#266234', '#3d9a50', '#5fb56f', '#46654c', '#7a9d80',
  ];

  ngOnInit(): void {
    this.loadGarden();
  }

  private loadGarden(): void {
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
    const baseHeight = 60;
    const maxAdditionalHeight = 100;

    return {
      lifeArea,
      plantType: this.getPlantType(lifeArea.icon),
      height: baseHeight + (healthFactor * maxAdditionalHeight),
      color: lifeArea.color || this.plantColors[index % this.plantColors.length],
      leaves: Math.floor(2 + healthFactor * 6),
      flowers: lifeArea.healthScore >= 50 ? Math.floor(healthFactor * 4) : 0,
      position: index,
    };
  }

  private getPlantType(icon: string): string {
    const typeMap: Record<string, string> = {
      leaf: 'fern',
      heart: 'flower',
      brain: 'succulent',
      briefcase: 'bamboo',
      dumbbell: 'palm',
      book: 'tree',
      palette: 'flower',
      users: 'bush',
      dollar: 'cactus',
    };
    return typeMap[icon] || 'flower';
  }

  getStemPath(plant: PlantData): string {
    const baseY = 200;
    const topY = 200 - plant.height;
    const midY = baseY - plant.height / 2;
    const curve = plant.lifeArea.healthScore > 70 ? 5 : plant.lifeArea.healthScore > 40 ? 8 : 12;

    return `M 40 ${baseY} Q ${40 + curve} ${midY} 40 ${topY}`;
  }

  getLeaves(plant: PlantData): { x: number; y: number; rx: number; ry: number; color: string; rotation: number }[] {
    const leaves = [];
    const baseY = 200;

    for (let i = 0; i < plant.leaves; i++) {
      const progress = (i + 1) / (plant.leaves + 1);
      const y = baseY - (plant.height * progress);
      const side = i % 2 === 0 ? -1 : 1;
      const size = 8 + (1 - progress) * 6;

      leaves.push({
        x: 40 + (side * 15),
        y: y,
        rx: size,
        ry: size * 0.5,
        color: this.adjustColor(plant.color, i * 10 - 20),
        rotation: side * (20 + Math.random() * 20),
      });
    }

    return leaves;
  }

  getFlowers(plant: PlantData): { x: number; y: number; r: number; color: string; hasCenter: boolean }[] {
    const flowers = [];
    const topY = 200 - plant.height;

    if (plant.flowers > 0) {
      flowers.push({
        x: 40,
        y: topY - 5,
        r: 6 + plant.flowers,
        color: plant.lifeArea.healthScore >= 75 ? '#ed87a8' : '#f5cd53', // bloom-400 or golden-300
        hasCenter: plant.lifeArea.healthScore >= 75,
      });
    }

    for (let i = 1; i < plant.flowers; i++) {
      const angle = (i / plant.flowers) * Math.PI;
      const radius = 12 + i * 3;
      flowers.push({
        x: 40 + Math.cos(angle) * radius,
        y: topY + Math.sin(angle) * 8,
        r: 4 + Math.random() * 2,
        color: '#f5cd53', // golden-300
        hasCenter: false,
      });
    }

    return flowers;
  }

  getHealthColor(score: number): string {
    if (score >= 75) return '#3d9a50'; // spirit-500
    if (score >= 50) return '#f2b82b'; // golden-400
    return '#e15f87'; // bloom-500
  }

  getHealthLabel(score: number): string {
    if (score >= 75) return 'Thriving';
    if (score >= 50) return 'Growing';
    return 'Needs care';
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getHealthGradient(score: number): string {
    if (score >= 75) return 'linear-gradient(135deg, #4CAF50, #8BC34A)';
    if (score >= 50) return 'linear-gradient(135deg, #FF9800, #FFB74D)';
    return 'linear-gradient(135deg, #f44336, #E57373)';
  }

  getEmoji(icon: string): string {
    const iconEmojis: Record<string, string> = {
      leaf: '🌿', heart: '❤️', brain: '🧠', briefcase: '💼',
      dumbbell: '💪', book: '📚', palette: '🎨', users: '👥', dollar: '💰',
    };
    return iconEmojis[icon] || '🌿';
  }

  private adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}
