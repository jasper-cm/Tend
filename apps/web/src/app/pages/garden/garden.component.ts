import { Component } from '@angular/core';

@Component({
  selector: 'tend-garden',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-soil">Your Life Garden</h2>
      <p class="text-stone-600">
        A holistic overview of all your life areas. See how each part of your
        garden is flourishing.
      </p>
      <!-- TODO: Garden visualization showing life area health -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
          <p class="text-stone-400">Life areas will appear here...</p>
        </div>
      </div>
    </div>
  `,
})
export class GardenComponent {}
