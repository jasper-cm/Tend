import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./tabs/tabs.component').then((m) => m.TabsComponent),
    children: [
      {
        path: 'garden',
        loadComponent: () =>
          import('./pages/garden/garden.page').then((m) => m.GardenPage),
      },
      {
        path: 'practices',
        loadComponent: () =>
          import('./pages/practices/practices.page').then((m) => m.PracticesPage),
      },
      {
        path: 'reflections',
        loadComponent: () =>
          import('./pages/reflections/reflections.page').then((m) => m.ReflectionsPage),
      },
      {
        path: 'guide',
        loadComponent: () =>
          import('./pages/garden-guide/garden-guide.page').then((m) => m.GardenGuidePage),
      },
      { path: '', redirectTo: 'garden', pathMatch: 'full' },
    ],
  },
];
