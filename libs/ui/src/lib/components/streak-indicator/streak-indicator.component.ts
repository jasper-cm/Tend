import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tend-streak-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inline-flex items-center gap-1.5 text-sm bg-golden-50 px-3 py-1.5 rounded-pill">
      <span class="text-golden-500">&#x1f525;</span>
      <span class="font-semibold text-golden-700">{{ currentStreak }}</span>
      <span class="text-earth-500" *ngIf="longestStreak > 0">
        <span class="text-earth-300">/</span> {{ longestStreak }}
      </span>
    </div>
  `,
})
export class StreakIndicatorComponent {
  @Input() currentStreak = 0;
  @Input() longestStreak = 0;
}
