import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/pages/public-layout/public-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { HospitalsComponent } from './features/hospitals/pages/hospitals/hospitals.component';

export const routes: Routes = [
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/pages/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent,
      ),
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/layout/admin-layout/admin-layout.component').then(
        (m) => m.AdminLayoutComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'talleres',
        pathMatch: 'full',
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/admin/pages/admin-events/admin-events.component').then(
            (m) => m.AdminEventsComponent,
          ),
      },
      {
        path: 'talleres',
        loadComponent: () =>
          import('./features/admin/pages/admin-workshops/admin-workshops.component').then(
            (m) => m.AdminWorkshopsComponent,
          ),
      },
      {
        path: 'espacios-amigos',
        loadComponent: () =>
          import('./features/admin/pages/admin-friendly-spaces/admin-friendly-spaces.component').then(
            (m) => m.AdminFriendlySpacesComponent,
          ),
      },
      {
        path: 'salas-universitarias',
        loadComponent: () =>
          import('./features/admin/pages/admin-university-rooms/admin-university-rooms.component').then(
            (m) => m.AdminUniversityRoomsComponent,
          ),
      },
      {
        path: 'experiencias',
        loadComponent: () =>
          import('./features/admin/pages/admin-experiences/admin-experiences.component').then(
            (m) => m.AdminExperiencesComponent,
          ),
      },
      {
        path: 'valoraciones',
        loadComponent: () =>
          import('./features/admin/pages/admin-feedback/admin-feedback.component').then(
            (m) => m.AdminFeedbackComponent,
          ),
      },
      {
        path: 'hospitales',
        loadComponent: () =>
          import('./features/admin/pages/admin-hospitals/admin-hospitals.component').then(
            (m) => m.AdminHospitalsComponent,
          ),
      },
    ],
  },

  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/pages/home/home.component').then(
            (m) => m.HomeComponent,
          ),
      },
      {
        path: 'salas-universitarias',
        loadComponent: () =>
          import('./features/university-rooms/pages/university-rooms/university-rooms.component').then(
            (m) => m.UniversityRoomsComponent,
          ),
      },
      {
        path: 'talleres',
        loadComponent: () =>
          import('./features/workshops/pages/workshops/workshops.component').then(
            (m) => m.WorkshopsComponent,
          ),
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/events/pages/events/events.component').then(
            (m) => m.EventsComponent,
          ),
      },
      {
        path: 'hospitales',
        component: HospitalsComponent,
      },
      {
        path: 'espacios-amigos',
        loadComponent: () =>
          import('./features/friendly-spaces/pages/friendly-spaces/friendly-spaces.component').then(
            (m) => m.FriendlySpacesComponent,
          ),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./features/contact/pages/contact/contact.component').then(
            (m) => m.ContactComponent,
          ),
      },
      {
        path: 'experiencias/:type',
        loadComponent: () =>
          import('./shared/components/experience-section/experience-section.component').then(
            (m) => m.ExperienceSectionComponent,
          ),
      },
      {
        path: 'experiencias/:type/compartir',
        loadComponent: () =>
          import('./shared/components/experience-form/experience-form.component').then(
            (m) => m.ExperienceFormComponent,
          ),
      },
      {
        path: 'colabora',
        loadComponent: () =>
          import('./features/collaborate/pages/collaborate/collaborate.component').then(
            (m) => m.CollaborateComponent,
          ),
      },
      {
        path: 'valora',
        loadComponent: () =>
          import('./features/feedback/pages/feedback/feedback.component').then(
            (m) => m.FeedbackComponent,
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
