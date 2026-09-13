import { AmamantaEvent, getEventPlatformLabel } from './amamanta-event';

/*
 * Genera lo necesario para añadir un evento al calendario del móvil: un enlace
 * de Google Calendar (Android) y un fichero .ics (Apple, Outlook y cualquier
 * otro).
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
 * En un .ics hay que escapar las barras invertidas, las comas, los puntos y
 * coma y los saltos de línea.
 */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/*
 * El formato exige líneas de 75 octetos como máximo; las que se pasan se
 * parten y continúan con un espacio al principio. Sin esto, una descripción
 * larga puede romper el fichero en algunos calendarios.
 */
function foldIcsLine(line: string): string {
  if (line.length <= 75) {
    return line;
  }

  const parts: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);

  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }

  if (rest.length > 0) {
    parts.push(` ${rest}`);
  }

  return parts.join('\r\n');
}

export function buildIcsContent(event: AmamantaEvent): string {
  const start = buildStartDate(event);

  if (!start) {
    return '';
  }

  const stamp = `${formatDateTime(new Date())}Z`;

  const when = event.startTime
    ? [
        `DTSTART:${formatDateTime(start)}`,
        `DTEND:${formatDateTime(
          addMinutes(start, DEFAULT_DURATION_MINUTES),
        )}`,
      ]
    : [
        `DTSTART;VALUE=DATE:${formatDate(start)}`,
        `DTEND;VALUE=DATE:${formatDate(addDays(start, 1))}`,
      ];

  const url = getCalendarUrl(event);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Amamanta//App Amamanta//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}@app.amamanta.es`,
    `DTSTAMP:${stamp}`,
    ...when,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(buildCalendarDescription(event))}`,
    `LOCATION:${escapeIcsText(getCalendarLocation(event))}`,
    /* URL es de tipo URI, no texto: no se escapa. */
    ...(url ? [`URL:${url}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`;
}

export function buildIcsFileName(event: AmamantaEvent): string {
  const slug = event.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return `${slug || 'actividad'}-amamanta.ics`;
}
