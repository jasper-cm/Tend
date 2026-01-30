import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  title: string;
  url: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'tend-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-cream flex">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none"
        [class.translate-x-0]="sidebarOpen()"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <!-- Sidebar Header -->
        <div class="bg-gradient-to-br from-spirit to-spirit-dark p-6 relative overflow-hidden">
          <!-- Decorative circles -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full"></div>

          <div class="relative z-10">
            <!-- Logo -->
            <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border-2 border-white/30">
              <span class="text-3xl">🌱</span>
            </div>

            <!-- App Name -->
            <h1 class="text-2xl font-bold text-white mb-1">Tend</h1>
            <p class="text-white/80 text-sm">Tend your life garden</p>

            <!-- Stats -->
            <div class="flex gap-6 mt-4">
              <div>
                <span class="text-xl font-bold text-white">8</span>
                <span class="text-xs text-white/70 block">Areas</span>
              </div>
              <div>
                <span class="text-xl font-bold text-white">12</span>
                <span class="text-xs text-white/70 block">Practices</span>
              </div>
              <div>
                <span class="text-xl font-bold text-white">5</span>
                <span class="text-xs text-white/70 block">Streak</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="p-4 flex-1 overflow-y-auto">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Navigate</p>

          <div class="space-y-1">
            @for (item of navItems; track item.url) {
              <a
                [routerLink]="item.url"
                routerLinkActive="bg-spirit/10 text-spirit-dark"
                [routerLinkActiveOptions]="{ exact: item.url === '/' }"
                class="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all group"
                (click)="closeSidebarOnMobile()"
              >
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110"
                  [style.background]="item.color + '20'"
                >
                  {{ item.icon }}
                </div>
                <span class="font-medium">{{ item.title }}</span>
              </a>
            }
          </div>

          <!-- Settings Section -->
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-3 px-3">Settings</p>

          <div class="space-y-1">
            @for (item of settingsItems; track item.title) {
              <a
                href="#"
                class="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-all"
              >
                <span class="text-lg">{{ item.icon }}</span>
                <span class="text-sm">{{ item.title }}</span>
              </a>
            }
          </div>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-100">
          <div class="flex items-center gap-3 px-3">
            <div class="w-10 h-10 bg-gradient-to-br from-spirit/20 to-sage/20 rounded-xl flex items-center justify-center">
              <span class="text-xl">🌿</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-spirit">Tend</p>
              <p class="text-xs text-gray-400">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 bg-black/50 z-40 lg:hidden"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-h-screen">
        <!-- Top Bar (Mobile) -->
        <header class="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-4 sticky top-0 z-30">
          <button
            (click)="toggleSidebar()"
            class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex items-center gap-2">
            <span class="text-xl">🌱</span>
            <span class="font-semibold text-gray-800">Tend</span>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-4 lg:p-8 bg-gray-50/50">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AppComponent {
  title = 'Tend';

  sidebarOpen = signal(false);

  navItems: NavItem[] = [
    { title: 'My Garden', url: '/', icon: '🌿', color: '#4CAF50' },
    { title: 'Life Areas', url: '/life-areas', icon: '🌱', color: '#8BC34A' },
    { title: 'Practices', url: '/practices', icon: '💪', color: '#FF9800' },
    { title: 'Reflections', url: '/reflections', icon: '📝', color: '#2196F3' },
    { title: 'Garden Guide', url: '/garden-guide', icon: '✨', color: '#9C27B0' },
  ];

  settingsItems = [
    { title: 'Profile', icon: '👤' },
    { title: 'Notifications', icon: '🔔' },
    { title: 'Appearance', icon: '🌙' },
    { title: 'Help & Support', icon: '❓' },
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
