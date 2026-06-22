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
        path: 'salas-universitarias',
        loadComponent: () =>
          import(
            './features/university-rooms/pages/university-rooms/university-rooms.component'
          ).then((m) => m.UniversityRoomsComponent)
      },
      {
        path: 'talleres',
        loadComponent: () =>
          import('./features/workshops/pages/workshops/workshops.component').then(
            (m) => m.WorkshopsComponent
          )
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/events/pages/events/events.component').then(
            (m) => m.EventsComponent
          )
      },
      {
        path: 'espacios-amigos',
        loadComponent: () =>
          import(
            './features/friendly-spaces/pages/friendly-spaces/friendly-spaces.component'
          ).then((m) => m.FriendlySpacesComponent)
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/contact/pages/contact/contact.component').then(
            (m) => m.ContactComponent
          )
      },
      {
        path: 'colabora',
        loadComponent: () =>
          import(
            './features/collaborate/pages/collaborate/collaborate.component'
          ).then((m) => m.CollaborateComponent)
      },
      {
        path: 'valora',
        loadComponent: () =>
          import('./features/feedback/pages/feedback/feedback.component').then(
            (m) => m.FeedbackComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
