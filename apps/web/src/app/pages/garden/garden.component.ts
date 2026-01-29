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
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-earth-800">Your Life Garden</h2>
          <p class="text-earth-600">
            A holistic view of all your life areas. See how each part of your garden is flourishing.
          </p>
        </div>
        @if (averageHealth() > 0) {
          <div class="text-right">
            <div class="text-3xl font-bold" [style.color]="getHealthColor(averageHealth())">
              {{ averageHealth() }}
            </div>
            <div class="text-sm text-earth-600">Garden Health</div>
          </div>
        }
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-pulse text-sage-500">Growing your garden...</div>
        </div>
      } @else {
        <!-- Side-scrolling Garden Visualization -->
        <div class="relative bg-gradient-spirit rounded-soft-lg overflow-hidden shadow-soft" style="height: 320px;">
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
          <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-earth-700 to-earth-500 rounded-b-soft-lg"></div>
          <div class="absolute bottom-20 left-0 right-0 h-8 bg-gradient-to-t from-earth-500/80 to-transparent"></div>

          <!-- Grass line -->
          <div class="absolute bottom-20 left-0 right-0 h-4 bg-gradient-to-t from-spirit-700 to-spirit-500 opacity-80"></div>

          <!-- Scrollable garden container -->
          <div
            class="absolute bottom-24 left-0 right-0 h-48 overflow-x-auto overflow-y-hidden scrollbar-thin"
          >
            <div
              class="flex items-end h-full px-8 gap-8"
              [style.minWidth.px]="plants().length * 140 + 100"
            >
              @for (plant of plants(); track plant.lifeArea.id; let i = $index) {
                <a
                  [routerLink]="['/life-areas', plant.lifeArea.id]"
                  class="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                  [style.marginLeft.px]="i === 0 ? 20 : 0"
                >
                  <!-- Plant SVG -->
                  <div class="relative" [style.height.px]="plant.height + 40">
                    <svg
                      [attr.width]="80"
                      [attr.height]="plant.height + 40"
                      viewBox="0 0 80 200"
                      class="drop-shadow-md"
                    >
                      <!-- Stem -->
                      <path
                        [attr.d]="getStemPath(plant)"
                        [attr.stroke]="plant.color"
                        stroke-width="4"
                        fill="none"
                        stroke-linecap="round"
                      />

                      <!-- Leaves -->
                      @for (leaf of getLeaves(plant); track $index) {
                        <ellipse
                          [attr.cx]="leaf.x"
                          [attr.cy]="leaf.y"
                          [attr.rx]="leaf.rx"
                          [attr.ry]="leaf.ry"
                          [attr.fill]="leaf.color"
                          [attr.transform]="'rotate(' + leaf.rotation + ' ' + leaf.x + ' ' + leaf.y + ')'"
                          class="transition-all duration-300"
                        />
                      }

                      <!-- Flowers/buds based on health -->
                      @for (flower of getFlowers(plant); track $index) {
                        <circle
                          [attr.cx]="flower.x"
                          [attr.cy]="flower.y"
                          [attr.r]="flower.r"
                          [attr.fill]="flower.color"
                          class="transition-all duration-300"
                        />
                        @if (flower.hasCenter) {
                          <circle
                            [attr.cx]="flower.x"
                            [attr.cy]="flower.y"
                            [attr.r]="flower.r * 0.4"
                            fill="#f5cd53"
                          />
                        }
                      }
                    </svg>

                    <!-- Health indicator -->
                    <div
                      class="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-pill text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      [style.backgroundColor]="getHealthColor(plant.lifeArea.healthScore)"
                    >
                      {{ plant.lifeArea.healthScore }}
                    </div>
                  </div>

                  <!-- Label -->
                  <div class="mt-2 text-center">
                    <div class="text-sm font-medium text-earth-800 group-hover:text-spirit-600 transition-colors">
                      {{ plant.lifeArea.name }}
                    </div>
                    <div class="text-xs text-earth-500">
                      {{ getHealthLabel(plant.lifeArea.healthScore) }}
                    </div>
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

          <!-- Scroll hint -->
          @if (plants().length > 4) {
            <div class="absolute bottom-2 right-4 text-xs text-earth-500/60 flex items-center gap-1">
              <span>Scroll to explore</span>
              <span>&rarr;</span>
            </div>
          }
        </div>

        <!-- Garden Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-parchment rounded-soft p-4 text-center border border-sage-300/30 shadow-soft">
            <div class="text-2xl font-bold text-spirit-600">{{ plants().length }}</div>
            <div class="text-sm text-earth-600">Life Areas</div>
          </div>
          <div class="bg-parchment rounded-soft p-4 text-center border border-sage-300/30 shadow-soft">
            <div class="text-2xl font-bold text-spirit-600">{{ thrivingCount() }}</div>
            <div class="text-sm text-earth-600">Thriving</div>
          </div>
          <div class="bg-parchment rounded-soft p-4 text-center border border-sage-300/30 shadow-soft">
            <div class="text-2xl font-bold text-golden-500">{{ growingCount() }}</div>
            <div class="text-sm text-earth-600">Growing</div>
          </div>
          <div class="bg-parchment rounded-soft p-4 text-center border border-sage-300/30 shadow-soft">
            <div class="text-2xl font-bold text-bloom-500">{{ needsAttentionCount() }}</div>
            <div class="text-sm text-earth-600">Needs Care</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="flex flex-wrap gap-3">
          <a routerLink="/life-areas" class="px-4 py-2 bg-spirit-500 text-white rounded-soft hover:bg-spirit-600 transition-colors text-sm font-medium shadow-soft">
            Manage Life Areas
          </a>
          <a routerLink="/practices" class="px-4 py-2 bg-sage-400 text-earth-800 rounded-soft hover:bg-sage-500 transition-colors text-sm font-medium shadow-soft">
            View Practices
          </a>
          <a routerLink="/garden-guide" class="px-4 py-2 bg-golden-400 text-earth-800 rounded-soft hover:bg-golden-500 transition-colors text-sm font-medium shadow-soft">
            Ask Garden Guide
          </a>
        </div>
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

  private adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}
