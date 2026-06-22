import { Injectable } from '@angular/core';
import { ContactEmail, ContactLocation, ContactPhone } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private readonly emails: ContactEmail[] = [
    {
      id: 'secretaria',
      title: 'Secretaría',
      description: 'Consultas generales sobre la asociación.',
      email: 'secretaria@amamanta.es'
    },
    {
      id: 'soporte-virtual',
      title: 'Soporte virtual',
      description: 'Consultas sobre talleres virtuales.',
      email: 'inscripciones@amamanta.es'
    },
    {
      id: 'talleres-lactancia',
      title: 'Talleres de lactancia',
      description: 'Información sobre talleres presenciales.',
      email: 'barbara@amamanta.es'
    },
    {
      id: 'asesoramiento-legal',
      title: 'Asesoramiento legal',
      description: 'Consultas jurídicas relacionadas con lactancia y maternidad.',
      email: 'juridico@amamanta.es'
    }
  ];

  private readonly phones: ContactPhone[] = [
    {
      id: 'ana',
      name: 'Ana',
      description: 'Asesora de lactancia',
      phone: '667048284'
    },
    {
      id: 'barbara',
      name: 'Bárbara',
      description: 'Asesora de lactancia',
      phone: '699420414'
    },
    {
      id: 'pilar',
      name: 'Pilar',
      description: 'Asesora de lactancia',
      phone: '646701446'
    },
    {
      id: 'natascha',
      name: 'Natascha',
      description: 'Asesora de lactancia',
      phone: '615076014'
    },
    {
      id: 'gloria',
      name: 'Gloria',
      description: 'Lactancia gemelar',
      phone: '637780644'
    },
    {
      id: 'carmen',
      name: 'Carmen',
      description: 'Bebés prematuros',
      phone: '620741236'
    }
  ];

  private readonly location: ContactLocation = {

  title: 'Sede de Amamanta',

  building: 'Centro Club de Convivencia',

  floor: 'Primera planta',

  address: 'C/ Lluís Santàngel, s/n, Vilamarxant',

  description:
    'Espacio donde se desarrollan reuniones, actividades y acciones de apoyo a la lactancia materna.',

  googleMapsUrl:
     'https://www.google.com/maps/search/?api=1&query=C%2F%20Llu%C3%ADs%20Sant%C3%A0ngel%20s%2Fn%20Vilamarxant'

};


  getEmails(): ContactEmail[] {
    return this.emails;
  }

  getPhones(): ContactPhone[] {
    return this.phones;
  }

  getLocation(): ContactLocation {
    return this.location;
  }
}
