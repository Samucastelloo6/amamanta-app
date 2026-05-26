import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/pages/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/pages/home/home.component').then(
            (m) => m.HomeComponent
          )
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./features/resources/pages/resources/resources.component').then(
            (m) => m.ResourcesComponent
          )
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./features/map/pages/map/map.component').then(
            (m) => m.MapComponent
          )
      },
      {
        path: 'community',
        loadComponent: () =>
          import('./features/community/pages/community/community.component').then(
            (m) => m.CommunityComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
