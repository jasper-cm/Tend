import { Component } from '@angular/core';

@Component({
  selector: 'tend-reflections',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-soil">Reflections</h2>
      <p class="text-bark">
        Journal entries and reflections on your growth across life areas.
      </p>
      <!-- TODO: Reflection journal with life area tagging -->
    </div>
  `,
})
export class ReflectionsComponent {}
