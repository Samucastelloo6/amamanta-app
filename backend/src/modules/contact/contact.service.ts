import { AppError } from '../../shared/errors/app-error.js';
import { ContactModel } from './contact.model.js';

export async function getContactInformation() {
  const contact = await ContactModel.findOne({
    key: 'main',
  }).exec();

  if (!contact) {
    throw new AppError(
      404,
      'La información de contacto no está disponible',
      'CONTACT_INFORMATION_NOT_FOUND',
    );
  }

  return contact;
}
