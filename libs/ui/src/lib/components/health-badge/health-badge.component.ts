import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tend-health-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium transition-all duration-200"
      [ngClass]="badgeClass"
    >
      {{ score }}%
    </span>
  `,
})
export class HealthBadgeComponent {
  @Input() score = 0;

  get badgeClass(): string {
    if (this.score >= 75) return 'bg-spirit-100 text-spirit-700';
    if (this.score >= 50) return 'bg-golden-100 text-golden-700';
    if (this.score >= 25) return 'bg-bloom-100 text-bloom-700';
    return 'bg-earth-200 text-earth-700';
  }
}
