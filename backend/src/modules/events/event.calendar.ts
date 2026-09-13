import type {
  EventHydratedDocument,
  EventOnlinePlatform,
} from './event.model.js';

const PLATFORM_LABELS: Record<EventOnlinePlatform, string> = {
  zoom: 'Zoom',
  meet: 'Google Meet',
  teams: 'Microsoft Teams',
  other: 'Reunión online',
};

/*
 * Genera el fichero de calendario (.ics) de un evento.
 *
 * Se genera aquí y no en el navegador a propósito. Si el navegador fabrica el
 * fichero y lo fuerza como descarga, el iPhone lo guarda en Archivos y no pasa
 * nada más. Sirviéndolo desde la API con su tipo de contenido y
 * `Content-Disposition: inline`, Safari abre directamente la pantalla de
 * «Añadir a Calendario».
 *
 * Las horas se escriben «flotantes», sin zona horaria: el calendario las
 * interpreta en la hora local de quien las añade. Es lo correcto aquí porque
 * todas las actividades son en Valencia y quien las apunta está en la misma
 * hora; poner una zona fija haría que alguien de viaje viese una hora distinta
 * a la que muestra la aplicación.
 */

const DEFAULT_DURATION_MINUTES = 120;

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/* aaaammdd, en hora local del servidor no: se usa la fecha tal cual se guardó. */
function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate(),
  )}`;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

/*
 * La fecha se guarda como un instante UTC a medianoche y la hora aparte, en
 * texto. Se combinan sin tocar husos para que salga exactamente la hora que
 * muestra la aplicación.
 */
function formatDateTime(date: Date, time: string, extraMinutes = 0): string {
  const [rawHours, rawMinutes] = time.split(':').map(Number);

  const totalMinutes =
    (rawHours ?? 0) * 60 + (rawMinutes ?? 0) + extraMinutes;

  const dayOffset = Math.floor(totalMinutes / (24 * 60));
  const minutesInDay = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);

  const day = dayOffset === 0 ? date : addDays(date, dayOffset);

  return `${formatDate(day)}T${pad(Math.floor(minutesInDay / 60))}${pad(
    minutesInDay % 60,
  )}00`;
}

function getCalendarLocation(event: EventHydratedDocument): string {
  if (event.mode === 'online') {
    return event.onlinePlatform
      ? PLATFORM_LABELS[event.onlinePlatform]
      : 'Reunión online';
  }

  return event.location ?? '';
}

/*
 * Todo lo que conviene tener a mano cuando salta el aviso del calendario: la
 * descripción, el enlace de la reunión y el código de acceso.
 */
function buildDescription(event: EventHydratedDocument): string {
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

/* En un .ics se escapan las barras, las comas, los puntos y coma y los saltos. */
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/*
 * El formato exige líneas de 75 octetos como máximo; las que se pasan se
 * parten y continúan con un espacio. Sin esto, una descripción larga rompe el
 * fichero en algunos calendarios.
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

function buildStamp(): string {
  const now = new Date();

  return `${formatDate(now)}T${pad(now.getUTCHours())}${pad(
    now.getUTCMinutes(),
  )}${pad(now.getUTCSeconds())}Z`;
}

export function buildEventIcs(event: EventHydratedDocument): string {
  const when = event.startTime
    ? [
        `DTSTART:${formatDateTime(event.date, event.startTime)}`,
        `DTEND:${formatDateTime(
          event.date,
          event.startTime,
          DEFAULT_DURATION_MINUTES,
        )}`,
      ]
    : [
        `DTSTART;VALUE=DATE:${formatDate(event.date)}`,
        `DTEND;VALUE=DATE:${formatDate(addDays(event.date, 1))}`,
      ];

  const url = event.mode === 'online' ? event.onlineUrl : event.googleMapsUrl;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Amamanta//App Amamanta//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event._id.toString()}@app.amamanta.es`,
    `DTSTAMP:${buildStamp()}`,
    ...when,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(buildDescription(event))}`,
    `LOCATION:${escapeIcsText(getCalendarLocation(event))}`,
    /* URL es de tipo URI, no texto: no se escapa. */
    ...(url ? [`URL:${url}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`;
}

export function buildEventIcsFileName(event: EventHydratedDocument): string {
  const slug = event.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return `${slug || 'actividad'}-amamanta.ics`;
}
