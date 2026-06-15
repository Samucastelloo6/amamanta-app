import { Injectable } from '@angular/core';
import { AmamantaEvent } from '../models/amamanta-event';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private readonly events: AmamantaEvent[] = [
    {
  id: 'alimentacion-complementaria-leliana',
  title: 'Primeros pasos en la alimentación complementaria',
  date: '2026-06-02',
  startTime: '17:00',
  location: 'Taller de L’Eliana',
  workshopId: 'taller-leliana',
  description: 'Charla a cargo de Elsa Buendía.',
  speaker: 'Elsa Buendía',
  isActive: true
},
{
  id: 'banco-leche-la-fe',
  title: 'Acto de agradecimiento a las donantes de leche',
  date: '2026-06-03',
  startTime: '17:00',
  endTime: '19:00',
  location: 'Banco de Leche Materna de La Fe',
  description: 'Participación en el acto organizado por el Banco de Leche Materna de La Fe.',
  requiresRegistration: true,
  isActive: true
},
{
  id: 'maternidad-primeros-dias-mislata',
  title: 'La maternidad en los primeros días',
  date: '2026-06-04',
  startTime: '17:30',
  location: 'Casa de la Dona, Mislata',
  workshopId: 'taller-mislata',
  description: 'Charla “De tu vientre a tus brazos” a cargo de Elisa Crego y Candela Perpinyá.',
  speaker: 'Elisa Crego y Candela Perpinyá',
  isActive: true
},
{
  id: 'suelo-pelvico-picanya',
  title: 'Cuidado del suelo pélvico en el embarazo y postparto',
  date: '2026-06-05',
  startTime: '16:00',
  location: 'Taller de lactancia de Picanya',
  workshopId: 'taller-picanya',
  description: 'Charla a cargo de Lucía Berti.',
  speaker: 'Lucía Berti',
  isActive: true
},
{
  id: 'destete-respetuoso-vilamarxant',
  title: 'Destete respetuoso',
  date: '2026-06-09',
  startTime: '17:30',
  location: 'Taller de lactancia de Vilamarxant',
  workshopId: 'taller-vilamarxant',
  description: 'Taller temático sobre destete respetuoso.',
  isActive: true
},
{
  id: 'primeros-pasos-zapatos-torrent',
  title: 'Primeros pasos: los bebés no necesitan zapatos para caminar',
  date: '2026-06-11',
  startTime: '11:00',
  location: 'Casa de la Dona de Torrent',
  description: 'Charla a cargo de Héctor Nebot.',
  speaker: 'Héctor Nebot',
  isActive: true
},
{
  id: 'criando-igualdad-mislata',
  title: 'Criando en igualdad para una sociedad más justa y respetuosa',
  date: '2026-06-11',
  startTime: '17:30',
  location: 'Casa de la Dona de Mislata',
  workshopId: 'taller-mislata',
  description: 'Charla a cargo de Silvia Ferrandis, educadora y comunicadora.',
  speaker: 'Silvia Ferrandis',
  isActive: true
},
{
  id: 'primeros-auxilios-picanya',
  title: 'Primeros auxilios en la infancia',
  date: '2026-06-12',
  startTime: '16:00',
  location: 'Taller de lactancia de Picanya',
  workshopId: 'taller-picanya',
  description: 'Charla a cargo de Nuria Gómez.',
  speaker: 'Nuria Gómez',
  isActive: true
},
{
  id: 'mocos-fuera-quart',
  title: '¡Mocos fuera! Higiene nasal y prevención',
  date: '2026-06-15',
  startTime: '11:00',
  location: 'Taller de Quart de Poblet',
  workshopId: 'taller-quart-poblet',
  description: 'Charla a cargo de Rut Sierra.',
  speaker: 'Rut Sierra',
  isActive: true
},
{
  id: 'maternidades-sostenibles-vilamarxant',
  title: 'Maternidades Sostenibles',
  date: '2026-06-15',
  startTime: '16:00',
  endTime: '18:00',
  location: 'Casa de la Juventud de Vilamarxant',
  workshopId: 'taller-vilamarxant',
  description: 'Colaboración con la Fundación Fisabio. Taller presencial para familias con hijos de 0-3 años.',
  requiresRegistration: true,
  isActive: true
},
{
  id: 'cuidados-pediatricos-vilamarxant',
  title: 'Cuidados pediátricos en la primera infancia',
  date: '2026-06-16',
  startTime: '',
  location: 'Taller de Vilamarxant',
  workshopId: 'taller-vilamarxant',
  description: 'Charla a cargo del equipo de pediatría del centro de salud.',
  isActive: true
},
{
  id: 'taller-de-talleres-vilamarxant',
  title: 'Taller de talleres',
  date: '2026-06-20',
  startTime: '10:00',
  location: 'Vilamarxant',
  workshopId: 'taller-vilamarxant',
  description: 'Encuentro para personas interesadas en conocer o poner en marcha talleres de lactancia materna. Especial convivencia, con comida.',
  isActive: true
},
{
  id: 'primeros-auxilios-valterna',
  title: 'Primeros auxilios en la infancia',
  date: '2026-06-30',
  startTime: '',
  location: 'Centro de Salud de Valterna',
  workshopId: 'taller-valterna',
  description: 'Charla a cargo del servicio de pediatría del CS de Valterna.',
  isActive: true
}
  ];

  getEvents(): AmamantaEvent[] {
    return this.events.filter(event => event.isActive);
  }
}
