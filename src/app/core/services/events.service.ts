import { Injectable, signal } from '@angular/core';
import { AmamantaEvent } from '../models/amamanta-event';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly events = signal<AmamantaEvent[]>([
    {
      id: 'alimentacion-complementaria-leliana',
      title: 'Primeros pasos en la alimentación complementaria',
      date: '2026-06-02',
      startTime: '17:00',
      location: 'Taller de L’Eliana',
      description: 'Charla a cargo de Elsa Buendía.',
      googleMapsUrl: 'https://maps.app.goo.gl/cxeQ7Sr1hYvrtv4VA',
      isActive: true,
    },
    {
      id: 'banco-leche-la-fe',
      title: 'Acto de agradecimiento a las donantes de leche',
      date: '2026-06-03',
      startTime: '17:00',
      location: 'Banco de Leche Materna de La Fe',
      description:
        'Participación en el acto organizado por el Banco de Leche Materna de La Fe.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: true,
      isActive: true,
    },
    {
      id: 'maternidad-primeros-dias-mislata',
      title: 'La maternidad en los primeros días',
      date: '2026-06-04',
      startTime: '17:30',
      location: 'Casa de la Dona, Mislata',
      description:
        'Charla “De tu vientre a tus brazos” a cargo de Elisa Crego y Candela Perpinyá.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'suelo-pelvico-picanya',
      title: 'Cuidado del suelo pélvico en el embarazo y postparto',
      date: '2026-06-05',
      startTime: '16:00',
      location: 'Taller de lactancia de Picanya',
      description: 'Charla a cargo de Lucía Berti.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'destete-respetuoso-vilamarxant',
      title: 'Destete respetuoso',
      date: '2026-06-09',
      startTime: '17:30',
      location: 'Taller de lactancia de Vilamarxant',
      description: 'Taller temático sobre destete respetuoso.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'primeros-pasos-zapatos-torrent',
      title: 'Primeros pasos: los bebés no necesitan zapatos para caminar',
      date: '2026-06-11',
      startTime: '11:00',
      location: 'Casa de la Dona de Torrent',
      description: 'Charla a cargo de Héctor Nebot.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'criando-igualdad-mislata',
      title: 'Criando en igualdad para una sociedad más justa y respetuosa',
      date: '2026-06-11',
      startTime: '17:30',
      location: 'Casa de la Dona de Mislata',
      description:
        'Charla a cargo de Silvia Ferrandis, educadora y comunicadora.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'primeros-auxilios-picanya',
      title: 'Primeros auxilios en la infancia',
      date: '2026-06-12',
      startTime: '16:00',
      location: 'Taller de lactancia de Picanya',
      description: 'Charla a cargo de Nuria Gómez.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'mocos-fuera-quart',
      title: '¡Mocos fuera! Higiene nasal y prevención',
      date: '2026-06-15',
      startTime: '11:00',
      location: 'Taller de Quart de Poblet',
      description: 'Charla a cargo de Rut Sierra.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'maternidades-sostenibles-vilamarxant',
      title: 'Maternidades Sostenibles',
      date: '2026-06-15',
      startTime: '16:00',
      location: 'Casa de la Juventud de Vilamarxant',
      description:
        'Colaboración con la Fundación Fisabio. Taller presencial para familias con hijos de 0-3 años.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: true,
      isActive: true,
    },
    {
      id: 'cuidados-pediatricos-vilamarxant',
      title: 'Cuidados pediátricos en la primera infancia',
      date: '2026-06-16',
      startTime: '',
      location: 'Taller de Vilamarxant',
      description:
        'Charla a cargo del equipo de pediatría del centro de salud.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'taller-de-talleres-vilamarxant',
      title: 'Taller de talleres',
      date: '2026-06-20',
      startTime: '10:00',
      location: 'Vilamarxant',
      description:
        'Encuentro para personas interesadas en conocer o poner en marcha talleres de lactancia materna. Especial convivencia, con comida.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
    {
      id: 'primeros-auxilios-valterna',
      title: 'Primeros auxilios en la infancia',
      date: '2026-06-30',
      startTime: '',
      location: 'Centro de Salud de Valterna',
      description:
        'Charla a cargo del servicio de pediatría del CS de Valterna.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      isActive: true,
    },
  ]);

  getEvents(): AmamantaEvent[] {
    return this.events().filter((event) => event.isActive);
  }

  getAdminEvents(): AmamantaEvent[] {
    return this.events();
  }

  addEvent(event: AmamantaEvent): void {
    this.events.update((events) => [...events, event]);
  }

  updateEvent(updatedEvent: AmamantaEvent): void {
    this.events.update((events) =>
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  }

  deleteEvent(eventId: string): void {
    this.events.update((events) =>
      events.filter((event) => event.id !== eventId),
    );
  }
}
