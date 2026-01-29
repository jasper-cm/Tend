import { Component } from '@angular/core';

@Component({
  selector: 'tend-garden-guide',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-soil">Garden Guide</h2>
      <p class="text-bark">
        Your AI-powered life coach. Ask questions, get insights, and receive
        personalized guidance for tending your life garden.
      </p>
      <!-- TODO: Chat interface with Garden Guide AI -->
      <div class="bg-parchment rounded-lg shadow-sm border border-sage/30 p-6">
        <p class="text-bark-light italic">Garden Guide chat coming soon...</p>
      </div>
    </div>
  `,
})
export class GardenGuideComponent {}
