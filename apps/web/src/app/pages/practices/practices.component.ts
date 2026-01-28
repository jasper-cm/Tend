import { Component } from '@angular/core';

@Component({
  selector: 'tend-practices',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-soil">Practices</h2>
      <p class="text-stone-600">
        The habits, routines, and actions you cultivate to tend your life garden.
      </p>
      <!-- TODO: Practice list with streak tracking and completion logging -->
    </div>
  `,
})
export class PracticesComponent {}
