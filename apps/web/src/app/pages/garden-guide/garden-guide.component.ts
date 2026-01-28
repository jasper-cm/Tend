import { Component } from '@angular/core';

@Component({
  selector: 'tend-garden-guide',
  standalone: true,
  template: `
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-soil">Garden Guide</h2>
      <p class="text-stone-600">
        Your AI-powered life coach. Ask questions, get insights, and receive
        personalized guidance for tending your life garden.
      </p>
      <!-- TODO: Chat interface with Garden Guide AI -->
      <div class="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <p class="text-stone-400 italic">Garden Guide chat coming soon...</p>
      </div>
    </div>
  `,
})
export class GardenGuideComponent {}
