import { AppError } from '../../shared/errors/app-error.js';
import { CollaborateModel } from './collaborate.model.js';

export async function getCollaborateInformation() {
  const collaborate = await CollaborateModel.findOne({
    key: 'main',
  }).exec();

  if (!collaborate) {
    throw new AppError(
      404,
      'La información para colaborar no está disponible',
      'COLLABORATE_INFORMATION_NOT_FOUND',
    );
  }

  return collaborate;
}
