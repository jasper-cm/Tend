import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'tend-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-cream">
      <header class="bg-leaf-dark text-parchment px-6 py-4">
        <h1 class="text-xl font-semibold tracking-tight">Tend</h1>
        <p class="text-sage text-sm">Tend your life garden</p>
      </header>
      <main class="container mx-auto px-4 py-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {
  title = 'Tend';
}
