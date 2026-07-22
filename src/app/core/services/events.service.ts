import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AmamantaEvent,
  CreateEventRequest,
  UpdateEventRequest,
} from '../models/amamanta-event';

interface ApiResponse<T> {
  success: true;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/events`;

  private readonly events = signal<AmamantaEvent[]>([]);

  loadEvents(): Observable<AmamantaEvent[]> {
    return this.http.get<ApiResponse<AmamantaEvent[]>>(this.baseUrl).pipe(
      map((response) => response.data),
      tap((events) => {
        this.events.set(events);
      }),
    );
  }

  getEvents(): AmamantaEvent[] {
    return this.events().filter((event) => event.isActive);
  }

  getAdminEvents(): AmamantaEvent[] {
    return this.events();
  }

  getEventById(eventId: string): Observable<AmamantaEvent> {
    return this.http
      .get<ApiResponse<AmamantaEvent>>(`${this.baseUrl}/${eventId}`)
      .pipe(map((response) => response.data));
  }

  addEvent(payload: CreateEventRequest): Observable<AmamantaEvent> {
    return this.http
      .post<ApiResponse<AmamantaEvent>>(this.baseUrl, payload)
      .pipe(
        map((response) => response.data),
        tap((createdEvent) => {
          this.events.update((events) => [...events, createdEvent]);
        }),
      );
  }

  updateEvent(
    eventId: string,
    payload: UpdateEventRequest,
  ): Observable<AmamantaEvent> {
    return this.http
      .patch<ApiResponse<AmamantaEvent>>(`${this.baseUrl}/${eventId}`, payload)
      .pipe(
        map((response) => response.data),
        tap((updatedEvent) => {
          this.events.update((events) =>
            events.map((event) =>
              event.id === updatedEvent.id ? updatedEvent : event,
            ),
          );
        }),
      );
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<AmamantaEvent>>(`${this.baseUrl}/${eventId}`)
      .pipe(
        tap(() => {
          this.events.update((events) =>
            events.filter((event) => event.id !== eventId),
          );
        }),
        map(() => undefined),
      );
  }
}
