import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthBadgeComponent } from '../health-badge/health-badge.component';

@Component({
  selector: 'tend-life-area-card',
  standalone: true,
  imports: [CommonModule, HealthBadgeComponent],
  template: `
    <div
      class="rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow"
      [style.border-left]="'4px solid ' + color"
      (click)="selected.emit()"
    >
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold text-soil">{{ name }}</h3>
        <tend-health-badge [score]="healthScore" />
      </div>
      <p class="text-sm text-bark">{{ description }}</p>
      <div class="mt-2 text-xs text-bark">
        {{ activePractices }} active practices
      </div>
    </div>
  `,
})
export class LifeAreaCardComponent {
  @Input() name = '';
  @Input() description = '';
  @Input() color = '#4a7c59';
  @Input() healthScore = 50;
  @Input() activePractices = 0;
  @Output() selected = new EventEmitter<void>();
}
