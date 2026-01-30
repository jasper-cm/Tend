import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'tend-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex bg-gradient-to-b from-green-50/80 via-white to-white">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-green-100/50 transform transition-all duration-500 ease-out lg:translate-x-0 lg:static"
        [class.translate-x-0]="sidebarOpen()"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <!-- Sidebar Header -->
        <div class="p-6 relative">
          <!-- Subtle gradient accent -->
          <div class="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent pointer-events-none"></div>

          <div class="relative z-10">
            <!-- Logo -->
            <div class="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-green-200/50">
              <span class="text-2xl">🌱</span>
            </div>

            <!-- App Name -->
            <h1 class="text-2xl font-semibold text-gray-800 tracking-tight">Tend</h1>
            <p class="text-green-600/80 text-sm mt-1">Nurture your inner garden</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="px-4 py-2 flex-1 overflow-y-auto">
          <div class="space-y-1">
            @for (item of navItems; track item.url) {
              <a
                [routerLink]="item.url"
                routerLinkActive="bg-green-50 text-green-700 shadow-sm"
                [routerLinkActiveOptions]="{ exact: item.url === '/' }"
                class="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-600 hover:bg-green-50/70 hover:text-green-700 transition-all duration-300 group"
                (click)="closeSidebarOnMobile()"
              >
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                  {{ item.icon }}
                </div>
                <span class="font-medium">{{ item.title }}</span>
              </a>
            }
          </div>

          <!-- Divider -->
          <div class="my-6 h-px bg-gradient-to-r from-transparent via-green-200/50 to-transparent"></div>

          <!-- Mindfulness Quote -->
          <div class="px-4 py-4 mx-2 rounded-2xl bg-gradient-to-br from-green-50/80 to-emerald-50/50 border border-green-100/50">
            <p class="text-xs text-green-700/70 italic leading-relaxed">
              "The garden is a mirror of the soul. Tend it with patience and love."
            </p>
            <div class="mt-2 flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              <span class="text-[10px] text-green-600/60 uppercase tracking-wider">Daily Wisdom</span>
            </div>
          </div>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-green-100/30">
          <div class="flex items-center gap-3 px-3 py-2">
            <div class="w-8 h-8 rounded-lg bg-green-100/80 flex items-center justify-center">
              <span class="text-sm">🌿</span>
            </div>
            <div>
              <p class="text-xs font-medium text-green-700">Tend v1.0</p>
              <p class="text-[10px] text-gray-400">Grow mindfully</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen relative">
        <!-- Decorative background elements -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-100/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <!-- Top Bar (Mobile) -->
        <header class="lg:hidden bg-white/80 backdrop-blur-lg border-b border-green-100/50 px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button
            (click)="toggleSidebar()"
            class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-green-50 transition-colors"
          >
            <svg class="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
              <span class="text-sm">🌱</span>
            </div>
            <span class="font-semibold text-gray-800">Tend</span>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-4 lg:p-8 relative z-10">
          <div class="max-w-6xl mx-auto">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class AppComponent {
  title = 'Tend';

  sidebarOpen = signal(false);

  navItems: NavItem[] = [
    { title: 'My Garden', url: '/', icon: '🌿' },
    { title: 'Life Areas', url: '/life-areas', icon: '🌱' },
    { title: 'Practices', url: '/practices', icon: '🧘' },
    { title: 'Reflections', url: '/reflections', icon: '📿' },
    { title: 'Garden Guide', url: '/garden-guide', icon: '✨' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }
}
