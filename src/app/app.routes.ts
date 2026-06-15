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
  path: 'eventos',
  loadComponent: () =>
    import('./features/events/pages/events/events.component')
      .then(m => m.EventsComponent)
},
      {
  path: 'salas-universitarias',
  loadComponent: () =>
    import('./features/university-rooms/pages/university-rooms/university-rooms.component')
      .then(m => m.UniversityRoomsComponent)
},
      {
  path: 'talleres',
  loadComponent: () =>
    import('./features/workshops/pages/workshops/workshops.component')
      .then(m => m.WorkshopsComponent)
},
{
  path: 'espacios-amigos',
  loadComponent: () =>
    import('./features/friendly-spaces/pages/friendly-spaces/friendly-spaces.component')
      .then(m => m.FriendlySpacesComponent)
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
