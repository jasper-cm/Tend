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
    <div class="space-y-8">
      <!-- Hero Welcome Section - Spiritual/Meditative -->
      <div class="bg-gradient-to-br from-green-50 via-white to-emerald-50/50 rounded-3xl p-8 lg:p-10 relative overflow-hidden border border-green-100/50 shadow-xl shadow-green-100/20">
        <!-- Decorative elements -->
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-green-200/30 to-emerald-200/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-green-100/40 to-transparent rounded-full blur-2xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-green-100/20 to-transparent rounded-full blur-3xl animate-breathe-slow"></div>

        <div class="relative z-10">
          <div class="flex items-start justify-between gap-8">
            <div class="flex-1">
              <p class="text-green-600/70 text-sm mb-2 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {{ getGreeting() }}
              </p>
              <h1 class="text-3xl lg:text-4xl font-semibold text-gray-800 mb-3 tracking-tight">Your Life Garden</h1>
              <p class="text-gray-600 max-w-lg leading-relaxed">
                Nurture every dimension of your life with mindful intention. Each area is a sacred plot in your personal garden.
              </p>
            </div>

            @if (averageHealth() > 0) {
              <!-- Health Ring - Zen Style -->
              <div class="hidden md:flex flex-col items-center">
                <div class="relative w-28 h-28">
                  <svg class="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="#dcfce7" stroke-width="6" fill="none"/>
                    <circle
                      cx="56" cy="56" r="48"
                      stroke="url(#healthGradient)"
                      stroke-width="6"
                      fill="none"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="301.6"
                      [attr.stroke-dashoffset]="301.6 - (301.6 * averageHealth() / 100)"
                      class="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#4ade80"/>
                        <stop offset="100%" stop-color="#22c55e"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-3xl font-semibold text-gray-800">{{ averageHealth() }}</span>
                    <span class="text-xs text-green-600/70">wellness</span>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Quick Stats - Clean Minimal -->
          @if (plants().length > 0) {
            <div class="flex gap-10 mt-8 pt-6 border-t border-green-100/50">
              <div class="text-center">
                <span class="text-3xl font-semibold text-gray-800">{{ plants().length }}</span>
                <span class="text-green-600/70 text-sm block mt-1">Life Areas</span>
              </div>
              <div class="text-center">
                <span class="text-3xl font-semibold text-green-600">{{ thrivingCount() }}</span>
                <span class="text-green-600/70 text-sm block mt-1">Thriving</span>
              </div>
              <div class="text-center md:hidden">
                <span class="text-3xl font-semibold text-gray-800">{{ averageHealth() }}%</span>
                <span class="text-green-600/70 text-sm block mt-1">Health</span>
              </div>
            </div>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex flex-col items-center justify-center py-20">
          <div class="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100/50 animate-breathe">
            <span class="text-4xl">🌱</span>
          </div>
          <p class="text-green-600/70 text-lg">Growing your garden...</p>
          <div class="flex gap-1.5 mt-4">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      } @else {
        <!-- Garden Stats Cards - Clean Zen Style -->
        @if (plants().length > 0) {
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl flex items-center justify-center">
                  <span class="text-xl">🌿</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Life Areas</span>
              </div>
              <div class="text-3xl font-semibold text-gray-800">{{ plants().length }}</div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-gradient-to-br from-green-200/70 to-emerald-100 rounded-xl flex items-center justify-center">
                  <span class="text-xl">✨</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Thriving</span>
              </div>
              <div class="text-3xl font-semibold text-green-600">{{ thrivingCount() }}</div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-gradient-to-br from-amber-100/70 to-yellow-50 rounded-xl flex items-center justify-center">
                  <span class="text-xl">🌻</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Growing</span>
              </div>
              <div class="text-3xl font-semibold text-amber-600">{{ growingCount() }}</div>
            </div>

            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-11 h-11 bg-gradient-to-br from-rose-100/70 to-pink-50 rounded-xl flex items-center justify-center">
                  <span class="text-xl">💧</span>
                </div>
                <span class="text-sm font-medium text-gray-500">Needs Care</span>
              </div>
              <div class="text-3xl font-semibold text-rose-500">{{ needsAttentionCount() }}</div>
            </div>
          </div>
        }

        <!-- Side-scrolling Garden Visualization - Zen Style -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 overflow-hidden shadow-lg shadow-green-100/10">
          <div class="px-8 py-5 border-b border-green-50">
            <h2 class="text-lg font-semibold text-gray-800">Garden Visualization</h2>
            <p class="text-sm text-green-600/60">Watch your life areas grow as you tend them</p>
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

        <!-- Life Areas List - Zen Style -->
        @if (plants().length > 0) {
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 overflow-hidden shadow-lg shadow-green-100/10">
            <div class="px-8 py-5 border-b border-green-50 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-800">Life Areas</h2>
                <p class="text-sm text-green-600/60">Tap an area to see details and tend it</p>
              </div>
              <a routerLink="/life-areas" class="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                Manage all →
              </a>
            </div>

            <div class="divide-y divide-green-50">
              @for (plant of plants(); track plant.lifeArea.id) {
                <a [routerLink]="['/life-areas', plant.lifeArea.id]" class="flex items-center gap-5 p-5 hover:bg-green-50/50 transition-all duration-300 group">
                  <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform duration-300 group-hover:scale-105" [style.background]="getHealthGradient(plant.lifeArea.healthScore)">
                    {{ getEmoji(plant.lifeArea.icon) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-800 group-hover:text-green-700 transition-colors">{{ plant.lifeArea.name }}</h3>
                    <p class="text-sm text-gray-500 truncate mt-0.5">{{ plant.lifeArea.description }}</p>
                    <div class="mt-3 h-2 bg-green-100/50 rounded-full overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-700 ease-out" [style.width.%]="plant.lifeArea.healthScore" [style.background]="'linear-gradient(90deg, ' + getHealthColor(plant.lifeArea.healthScore) + ', ' + getHealthColorLight(plant.lifeArea.healthScore) + ')'"></div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-semibold" [style.color]="getHealthColor(plant.lifeArea.healthScore)">{{ plant.lifeArea.healthScore }}%</div>
                    <div class="text-xs text-gray-500 mt-1">{{ getHealthLabel(plant.lifeArea.healthScore) }}</div>
                  </div>
                </a>
              }
            </div>
          </div>
        }

        <!-- Quick Actions - Zen Style -->
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 p-8 shadow-lg shadow-green-100/10">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">Mindful Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a routerLink="/practices" class="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/50 border border-green-100/50 hover:shadow-lg hover:shadow-green-100/30 hover:-translate-y-1 transition-all duration-300 group">
              <div class="w-12 h-12 bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <span class="text-xl">🧘</span>
              </div>
              <div>
                <div class="font-semibold text-gray-800">Log Practice</div>
                <div class="text-sm text-green-600/70">Track your rituals</div>
              </div>
            </a>
            <a routerLink="/reflections" class="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-100/50 hover:shadow-lg hover:shadow-blue-100/30 hover:-translate-y-1 transition-all duration-300 group">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <span class="text-xl">📿</span>
              </div>
              <div>
                <div class="font-semibold text-gray-800">Write Reflection</div>
                <div class="text-sm text-blue-600/70">Journal mindfully</div>
              </div>
            </a>
            <a routerLink="/garden-guide" class="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-violet-50/80 to-purple-50/50 border border-violet-100/50 hover:shadow-lg hover:shadow-violet-100/30 hover:-translate-y-1 transition-all duration-300 group">
              <div class="w-12 h-12 bg-gradient-to-br from-violet-200 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <span class="text-xl">✨</span>
              </div>
              <div>
                <div class="font-semibold text-gray-800">Ask Guide</div>
                <div class="text-sm text-violet-600/70">Seek wisdom</div>
              </div>
            </a>
          </div>
        </div>

        <!-- Empty State - Zen Style -->
        @if (plants().length === 0) {
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl border border-green-100/50 p-12 text-center shadow-lg shadow-green-100/10">
            <div class="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200/30 animate-breathe">
              <span class="text-5xl">🌱</span>
            </div>
            <h3 class="text-2xl font-semibold text-gray-800 mb-3">Begin Your Journey</h3>
            <p class="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Your life garden awaits. Plant the seeds of intention and watch them grow into beautiful life areas.
            </p>
            <a routerLink="/life-areas" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg shadow-green-200/50 hover:shadow-xl hover:-translate-y-0.5">
              <span>Plant Your First Seed</span>
              <span>→</span>
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

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getHealthGradient(score: number): string {
    if (score >= 75) return 'linear-gradient(135deg, #bbf7d0, #dcfce7)'; // soft green gradient
    if (score >= 50) return 'linear-gradient(135deg, #fde68a, #fef3c7)'; // soft amber gradient
    return 'linear-gradient(135deg, #fecdd3, #ffe4e6)'; // soft rose gradient
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
