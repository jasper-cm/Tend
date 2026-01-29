import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthBadgeComponent } from '../health-badge/health-badge.component';

@Component({
  selector: 'tend-life-area-card',
  standalone: true,
  imports: [CommonModule, HealthBadgeComponent],
  template: `
    <div
      class="card-interactive bg-white/70 backdrop-blur-sm rounded-softer p-5 cursor-pointer border border-sage-200/30 hover:shadow-soft-lg transition-all duration-250"
      [style.border-left]="'4px solid ' + color"
      (click)="selected.emit()"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-earth-900">{{ name }}</h3>
        <tend-health-badge [score]="healthScore" />
      </div>
      <p class="text-sm text-earth-600 leading-relaxed">{{ description }}</p>
      <div class="mt-3 flex items-center gap-2">
        <span class="text-xs font-medium text-sage-600 bg-sage-100/60 px-2.5 py-1 rounded-pill">
          {{ activePractices }} {{ activePractices === 1 ? 'practice' : 'practices' }}
        </span>
      </div>
    </div>
  `,
})
export class LifeAreaCardComponent {
  @Input() name = '';
  @Input() description = '';
  @Input() color = '#3d9a50';
  @Input() healthScore = 50;
  @Input() activePractices = 0;
  @Output() selected = new EventEmitter<void>();
}
