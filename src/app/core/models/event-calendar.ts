import { environment } from '../../../environments/environment';
import { AmamantaEvent, getEventPlatformLabel } from './amamanta-event';

/*
 * Lo necesario para añadir un evento al calendario del móvil: el enlace de
 * Google Calendar (Android) y la dirección del fichero .ics que sirve la API
 * (Apple, Outlook y cualquier otro).
 *
 * Las horas se escriben «flotantes», sin zona horaria: el calendario las
 * interpreta en la hora local de quien las añade. Es lo correcto aquí porque
 * todas las actividades son presenciales u online en Valencia y quien las
 * apunta está en la misma hora. Poner una zona fija haría que alguien de viaje
 * viese una hora distinta a la que muestra la app, que confunde más de lo que
 * arregla.
 */

const DEFAULT_DURATION_MINUTES = 120;

/*
 * Los eventos guardan el día y la hora de inicio por separado, y la hora puede
 * estar vacía («Hora por confirmar»).
 */
function buildStartDate(event: AmamantaEvent): Date | null {
  const [year, month, day] = event.date.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const [hours, minutes] = event.startTime
    ? event.startTime.split(':').map(Number)
    : [0, 0];

  return new Date(year, month - 1, day, hours ?? 0, minutes ?? 0, 0, 0);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/* aaaammdd */
function formatDate(date: Date): string {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
}

/* aaaammddThhmmss, sin zona horaria */
function formatDateTime(date: Date): string {
  return `${formatDate(date)}T${pad(date.getHours())}${pad(
    date.getMinutes(),
  )}00`;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

/* Dónde es: el lugar en los presenciales, la plataforma en los online. */
export function getCalendarLocation(event: AmamantaEvent): string {
  if (event.mode === 'online') {
    return getEventPlatformLabel(event.onlinePlatform);
  }

  return event.location;
}

/* El enlace útil: la reunión en los online, el mapa en los presenciales. */
function getCalendarUrl(event: AmamantaEvent): string {
  return event.mode === 'online' ? event.onlineUrl : event.googleMapsUrl;
}

/*
 * Todo lo que conviene tener a mano cuando salta el aviso del calendario: la
 * descripción, el enlace de la reunión y el código de acceso.
 */
export function buildCalendarDescription(event: AmamantaEvent): string {
  const lines: string[] = [event.description];

  if (event.mode === 'online') {
    if (event.onlineUrl) {
      lines.push('', `Enlace: ${event.onlineUrl}`);
    }

    if (event.onlineCode) {
      lines.push(`Código de acceso: ${event.onlineCode}`);
    }
  } else if (event.googleMapsUrl) {
    lines.push('', `Ubicación: ${event.googleMapsUrl}`);
  }

  if (event.requiresRegistration) {
    lines.push('', 'Requiere inscripción.');
  }

  return lines.join('\n');
}

/*
 * Enlace que abre Google Calendar con el evento ya relleno. En Android abre la
 * aplicación si está instalada.
 */
export function buildGoogleCalendarUrl(event: AmamantaEvent): string {
  const start = buildStartDate(event);

  if (!start) {
    return '';
  }

  const dates = event.startTime
    ? `${formatDateTime(start)}/${formatDateTime(
        addMinutes(start, DEFAULT_DURATION_MINUTES),
      )}`
    : `${formatDate(start)}/${formatDate(addDays(start, 1))}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates,
    details: buildCalendarDescription(event),
    location: getCalendarLocation(event),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/*
 * Dirección del fichero de calendario del evento.
 *
 * En producción es una ruta del propio dominio de la aplicación, no la de la
 * API: con la aplicación instalada en el móvil, iOS no deja que el código
 * navegue a otro dominio para abrir un fichero y no ocurre nada. Vercel hace
 * de puente hacia la API (ver `rewrites` en vercel.json).
 */
export function buildEventCalendarFileUrl(event: AmamantaEvent): string {
  return environment.calendarUrlPattern.replace('{id}', event.id);
}
