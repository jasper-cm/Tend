import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tend-health-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      [ngClass]="badgeClass"
    >
      {{ score }}%
    </span>
  `,
})
export class HealthBadgeComponent {
  @Input() score = 0;

  get badgeClass(): string {
    if (this.score >= 75) return 'bg-green-100 text-green-800';
    if (this.score >= 50) return 'bg-yellow-100 text-yellow-800';
    if (this.score >= 25) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  }
}
