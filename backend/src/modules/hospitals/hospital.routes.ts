import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createHospitalController,
  deleteHospitalController,
  getAllHospitalsController,
  getHospitalByIdController,
  updateHospitalController,
} from './hospital.controller.js';
import {
  createHospitalSchema,
  updateHospitalSchema,
} from './hospital.validation.js';

const hospitalRouter = Router();

hospitalRouter.get('/', getAllHospitalsController);

hospitalRouter.get('/:id', getHospitalByIdController);

hospitalRouter.post(
  '/',
  requireAuth,
  validate(createHospitalSchema),
  createHospitalController,
);

hospitalRouter.patch(
  '/:id',
  requireAuth,
  validate(updateHospitalSchema),
  updateHospitalController,
);

hospitalRouter.delete('/:id', requireAuth, deleteHospitalController);

export default hospitalRouter;
