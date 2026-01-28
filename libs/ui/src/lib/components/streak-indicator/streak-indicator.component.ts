import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tend-streak-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1 text-sm">
      <span class="text-sun">&#x1f525;</span>
      <span class="font-semibold">{{ currentStreak }}</span>
      <span class="text-bark" *ngIf="longestStreak > 0">/ {{ longestStreak }}</span>
    </div>
  `,
})
export class StreakIndicatorComponent {
  @Input() currentStreak = 0;
  @Input() longestStreak = 0;
}
