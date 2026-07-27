import 'dotenv/config';
import mongoose from 'mongoose';
import {
  EventModel,
  type EventDocument,
} from '../modules/events/event.model.js';

type EventSeed = Omit<EventDocument, 'createdAt' | 'updatedAt'>;

const events: EventSeed[] = [
{
      title: 'Primeros pasos en la alimentación complementaria',
      date: new Date('2026-06-02T00:00:00.000Z'),
      startTime: '17:00',
      location: 'Taller de L’Eliana',
      description: 'Charla a cargo de Elsa Buendía.',
      googleMapsUrl: 'https://maps.app.goo.gl/cxeQ7Sr1hYvrtv4VA',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Acto de agradecimiento a las donantes de leche',
      date: new Date('2026-06-03T00:00:00.000Z'),
      startTime: '17:00',
      location: 'Banco de Leche Materna de La Fe',
      description:
        'Participación en el acto organizado por el Banco de Leche Materna de La Fe.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: true,
      isActive: true,
    },
{
      title: 'La maternidad en los primeros días',
      date: new Date('2026-06-04T00:00:00.000Z'),
      startTime: '17:30',
      location: 'Casa de la Dona, Mislata',
      description:
        'Charla “De tu vientre a tus brazos” a cargo de Elisa Crego y Candela Perpinyá.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Cuidado del suelo pélvico en el embarazo y postparto',
      date: new Date('2026-06-05T00:00:00.000Z'),
      startTime: '16:00',
      location: 'Taller de lactancia de Picanya',
      description: 'Charla a cargo de Lucía Berti.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Destete respetuoso',
      date: new Date('2026-06-09T00:00:00.000Z'),
      startTime: '17:30',
      location: 'Taller de lactancia de Vilamarxant',
      description: 'Taller temático sobre destete respetuoso.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Primeros pasos: los bebés no necesitan zapatos para caminar',
      date: new Date('2026-06-11T00:00:00.000Z'),
      startTime: '11:00',
      location: 'Casa de la Dona de Torrent',
      description: 'Charla a cargo de Héctor Nebot.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Criando en igualdad para una sociedad más justa y respetuosa',
      date: new Date('2026-06-11T00:00:00.000Z'),
      startTime: '17:30',
      location: 'Casa de la Dona de Mislata',
      description:
        'Charla a cargo de Silvia Ferrandis, educadora y comunicadora.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Primeros auxilios en la infancia',
      date: new Date('2026-06-12T00:00:00.000Z'),
      startTime: '16:00',
      location: 'Taller de lactancia de Picanya',
      description: 'Charla a cargo de Nuria Gómez.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: '¡Mocos fuera! Higiene nasal y prevención',
      date: new Date('2026-06-15T00:00:00.000Z'),
      startTime: '11:00',
      location: 'Taller de Quart de Poblet',
      description: 'Charla a cargo de Rut Sierra.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Maternidades Sostenibles',
      date: new Date('2026-06-15T00:00:00.000Z'),
      startTime: '16:00',
      location: 'Casa de la Juventud de Vilamarxant',
      description:
        'Colaboración con la Fundación Fisabio. Taller presencial para familias con hijos de 0-3 años.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: true,
      isActive: true,
    },
{
      title: 'Cuidados pediátricos en la primera infancia',
      date: new Date('2026-06-16T00:00:00.000Z'),
      startTime: '',
      location: 'Taller de Vilamarxant',
      description:
        'Charla a cargo del equipo de pediatría del centro de salud.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Taller de talleres',
      date: new Date('2026-06-20T00:00:00.000Z'),
      startTime: '10:00',
      location: 'Vilamarxant',
      description:
        'Encuentro para personas interesadas en conocer o poner en marcha talleres de lactancia materna. Especial convivencia, con comida.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
{
      title: 'Primeros auxilios en la infancia',
      date: new Date('2026-06-30T00:00:00.000Z'),
      startTime: '',
      location: 'Centro de Salud de Valterna',
      description:
        'Charla a cargo del servicio de pediatría del CS de Valterna.',
      googleMapsUrl: 'https://maps.app.goo.gl/5JqJ8vY9Q9vY9Q9v',
      requiresRegistration: false,
      isActive: true,
    },
];

async function seedEvents(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('La variable MONGODB_URI no está definida.');
  }

  try {
    await mongoose.connect(mongoUri);

    await EventModel.deleteMany({});

    const insertedEvents = await EventModel.insertMany(events, {
      ordered: true,
    });

    console.log(
      `Seed completado: ${insertedEvents.length} eventos insertados.`,
    );
  } catch (error) {
    console.error('Error al ejecutar el seed de eventos:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedEvents();
