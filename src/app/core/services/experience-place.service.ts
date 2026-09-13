import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

import { PlaceOption } from '../models/experience-place';
import { ExperienceType } from '../models/experiencies';
import { getWorkshopLabel } from '../models/workshop';
import { FriendlySpacesService } from './friendlySpace.service';
import { HospitalService } from './hospital.service';
import { UniversityRoomService } from './universityRoom.service';
import { WorkshopService } from './workshop.service';

/*
 * Carga la lista de sitios que se pueden valorar según el tipo. Existe para
 * que el formulario público y el panel de administración no tengan que repetir
 * cada uno la misma decisión de «a qué servicio le pido la lista».
 *
 * Solo se ofrecen los sitios activos: el backend rechaza los que están dados
 * de baja, así que no tiene sentido enseñarlos en el desplegable.
 */
@Injectable({
  providedIn: 'root',
})
export class ExperiencePlaceService {
  private readonly workshopService = inject(WorkshopService);
  private readonly hospitalService = inject(HospitalService);
  private readonly universityRoomService = inject(UniversityRoomService);
  private readonly friendlySpacesService = inject(FriendlySpacesService);

  loadPlaces(type: ExperienceType): Observable<PlaceOption[]> {
    switch (type) {
      case 'workshops':
        return this.workshopService.loadWorkshops().pipe(
          map(() =>
            this.workshopService
              .getWorkshops()
              .filter((workshop) => workshop.isActive)
              .map((workshop) => ({
                id: workshop.id,
                label: getWorkshopLabel(workshop),
              })),
          ),
        );

      case 'hospitals':
        return this.hospitalService.loadHospitals().pipe(
          map(() =>
            this.hospitalService
              .getHospitals()
              .filter((hospital) => hospital.isActive)
              .map((hospital) => ({
                id: hospital.id,
                label: hospital.name,
              })),
          ),
        );

      case 'rooms':
        return this.universityRoomService.loadUniversityRooms().pipe(
          map(() =>
            this.universityRoomService
              .getUniversityRooms()
              .filter((room) => room.isActive)
              .map((room) => ({
                id: room.id,
                label: room.name,
              })),
          ),
        );

      case 'friendly-spaces':
        return this.friendlySpacesService.loadFriendlySpaces().pipe(
          map(() =>
            this.friendlySpacesService
              .getFriendlySpaces()
              .filter((space) => space.isActive)
              .map((space) => ({
                id: space.id,
                label: space.name,
              })),
          ),
        );
    }
  }

  /*
   * El panel de administración muestra valoraciones de los cuatro tipos a la
   * vez, así que necesita las cuatro listas.
   */
  loadAllPlaces(): Observable<Record<ExperienceType, PlaceOption[]>> {
    return forkJoin({
      workshops: this.loadPlaces('workshops'),
      hospitals: this.loadPlaces('hospitals'),
      rooms: this.loadPlaces('rooms'),
      'friendly-spaces': this.loadPlaces('friendly-spaces'),
    });
  }
}
