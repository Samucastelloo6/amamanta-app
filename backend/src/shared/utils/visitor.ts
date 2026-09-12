import { createHash } from 'node:crypto';

import { env } from '../../config/env.js';

/*
 * Sal derivada del secreto del servidor. Nunca sale de aquí y solo sirve para
 * que nadie pueda reconstruir una IP a partir de un identificador guardado.
 */
const VISITOR_SALT = createHash('sha256')
  .update(`analytics-visitor-salt|${env.JWT_SECRET}`)
  .digest('hex');

/*
 * Identificador anónimo de un visitante para un día concreto.
 *
 * Es un hash irreversible de la IP, el navegador, la fecha y la sal. Cambia
 * cada día, no permite recuperar la IP ni seguir a nadie entre días, y sirve
 * únicamente para no contar dos veces a la misma persona en la misma jornada.
 */
export function buildVisitorHash(
  ip: string,
  userAgent: string,
  date: string,
): string {
  return createHash('sha256')
    .update(`${VISITOR_SALT}|${date}|${ip}|${userAgent}`)
    .digest('hex');
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bing|yandex|duckduck|baidu|facebookexternalhit|whatsapp|telegram|preview|monitor|curl|wget|python|java|go-http|okhttp|axios|node-fetch|headless|lighthouse|pingdom|uptime|semrush|ahrefs|screaming/i;

/*
 * Solo se cuentan las peticiones que vienen de un navegador de verdad. Los
 * rastreadores, los monitores de disponibilidad y las herramientas de línea de
 * comandos se identifican en su user-agent y quedan fuera.
 */
export function isCountableVisitor(userAgent: string): boolean {
  if (!userAgent) {
    return false;
  }

  if (BOT_PATTERN.test(userAgent)) {
    return false;
  }

  // Prácticamente todos los navegadores reales empiezan por Mozilla/5.0.
  return userAgent.includes('Mozilla/');
}
