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
    if (this.score >= 75) return 'bg-leaf-light/20 text-leaf-dark';
    if (this.score >= 50) return 'bg-sun-light/20 text-sun';
    if (this.score >= 25) return 'bg-terracotta/10 text-terracotta';
    return 'bg-terracotta/20 text-soil';
  }
}
