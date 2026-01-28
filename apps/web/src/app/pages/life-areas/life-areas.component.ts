import { Component } from '@angular/core';

@Component({
  selector: 'tend-life-areas',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-soil">Life Areas</h2>
      <p class="text-stone-600">
        The areas of your life you are tending. Each one is a plot in your garden.
      </p>
      <!-- TODO: List/grid of life areas with health indicators -->
    </div>
  `,
})
export class LifeAreasComponent {}
