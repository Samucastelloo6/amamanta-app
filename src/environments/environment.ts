export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',

  /*
   * De dónde sale el fichero de calendario de un evento.
   *
   * En producción es una ruta del propio dominio, no la de la API: con la
   * aplicación instalada, iOS no deja que el código navegue a otro dominio
   * para abrir un fichero y no pasa nada. Vercel hace de puente hacia la API
   * (ver `rewrites` en vercel.json).
   */
  calendarUrlPattern: 'http://localhost:3000/api/events/{id}/calendar.ics',
};
