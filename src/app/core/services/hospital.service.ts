import { Injectable, signal } from '@angular/core';

import { Hospital } from '../models/hospital';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  private readonly hospitals = signal<Hospital[]>([
    {
      id: 'hospital-clinico-valencia',
      name: 'Hospital Universitario Clínico de Valencia',
      address: 'Av. de Blasco Ibáñez, 17, Valencia',
      latitude: 39.47868503138106,
      longitude: -0.3612873828530147,
      googleMapsUrl: 'https://maps.app.goo.gl/KoEZxAeHZMZREPwv6',
      schedule: 'Lunes, miércoles y viernes · 14:30 - 17:00',
      description:
        'Las voluntarias de Amamanta ofrecen acompañamiento e información sobre lactancia materna en la planta de maternidad.',
      isActive: true,
    },
    {
      id: 'hospital-manises',
      name: 'Hospital de Manises',
      address: 'Av. de la Generalitat Valenciana, 50, Manises',
      latitude: 39.48585043764619,
      longitude: -0.45265132135900515,
      googleMapsUrl: 'https://maps.app.goo.gl/Lo7SNAR1YuC2NNy89',
      schedule: 'Lunes y miércoles · 14:30 - 17:00. Sábados · 11:00 - 13:00.',
      description:
        'Las voluntarias de Amamanta ofrecen acompañamiento e información sobre lactancia materna en la planta de maternidad.',
      isActive: true,
    },
    {
      id: 'hospital-general-valencia',
      name: 'Hospital General Universitario de Valencia',
      address: 'Av. de les Tres Creus, 2, Valencia',
      latitude: 39.468432334706506,
      longitude: -0.4086125857793986,
      googleMapsUrl: 'https://maps.app.goo.gl/Jwk6dJZxezFi5nV88',
      schedule: 'Sábados · 10:30.',
      description:
        'Las voluntarias de Amamanta ofrecen acompañamiento e información sobre lactancia materna en la planta de maternidad.',
      isActive: true,
    },
    {
      id: 'hospital-ribera-alzira',
      name: 'Hospital Universitario de La Ribera',
      address: 'Carretera de Corbera, km 1, Alzira',
      latitude: 39.16029657648491,
      longitude: -0.4178188313097072,
      googleMapsUrl: 'https://maps.app.goo.gl/1d3aAPQYXN2mZCEH8',
      schedule: 'Lunes · 14:30 - 17:00.',
      description:
        'Las voluntarias de Amamanta ofrecen acompañamiento e información sobre lactancia materna en la planta de maternidad.',
      isActive: true,
    },
  ]);

  getHospitals(): Hospital[] {
    return this.hospitals().filter((hospital) => hospital.isActive);
  }

  getAdminHospitals(): Hospital[] {
    return this.hospitals();
  }

  addHospital(hospital: Hospital): void {
    this.hospitals.update((hospitals) => [...hospitals, hospital]);
  }

  updateHospital(updatedHospital: Hospital): void {
    this.hospitals.update((hospitals) =>
      hospitals.map((hospital) =>
        hospital.id === updatedHospital.id ? updatedHospital : hospital,
      ),
    );
  }

  deleteHospital(hospitalId: string): void {
    this.hospitals.update((hospitals) =>
      hospitals.filter((hospital) => hospital.id !== hospitalId),
    );
  }
}
