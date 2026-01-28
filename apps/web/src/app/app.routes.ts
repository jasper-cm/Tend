import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/garden/garden.component').then((m) => m.GardenComponent),
  },
  {
    path: 'life-areas',
    loadComponent: () =>
      import('./pages/life-areas/life-areas.component').then((m) => m.LifeAreasComponent),
  },
  {
    path: 'life-areas/:id',
    loadComponent: () =>
      import('./pages/life-area-detail/life-area-detail.component').then(
        (m) => m.LifeAreaDetailComponent
      ),
  },
  {
    path: 'practices',
    loadComponent: () =>
      import('./pages/practices/practices.component').then((m) => m.PracticesComponent),
  },
  {
    path: 'reflections',
    loadComponent: () =>
      import('./pages/reflections/reflections.component').then((m) => m.ReflectionsComponent),
  },
  {
    path: 'garden-guide',
    loadComponent: () =>
      import('./pages/garden-guide/garden-guide.component').then(
        (m) => m.GardenGuideComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
