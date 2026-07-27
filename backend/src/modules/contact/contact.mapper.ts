import type { ContactHydratedDocument } from './contact.model.js';

export interface ContactResponse {
  emails: {
    id: string;
    title: string;
    description: string;
    email: string;
  }[];

  phones: {
    id: string;
    name: string;
    description: string;
    phone: string;
  }[];

  location: {
    title: string;
    building: string;
    floor: string;
    address: string;
    description: string;
    latitude: number;
    longitude: number;
  };
}

export function mapContactToResponse(
  contact: ContactHydratedDocument,
): ContactResponse {
  return {
    emails: contact.emails.map((email) => ({
      id: email.id,
      title: email.title,
      description: email.description,
      email: email.email,
    })),

    phones: contact.phones.map((phone) => ({
      id: phone.id,
      name: phone.name,
      description: phone.description,
      phone: phone.phone,
    })),

    location: {
      title: contact.location.title,
      building: contact.location.building,
      floor: contact.location.floor,
      address: contact.location.address,
      description: contact.location.description,
      latitude: contact.location.latitude,
      longitude: contact.location.longitude,
    },
  };
}
