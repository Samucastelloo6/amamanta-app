import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createEventController,
  deleteEventController,
  getAllEventsController,
  getEventByIdController,
  updateEventController,
} from './event.controller.js';
import { createEventSchema, updateEventSchema } from './event.validation.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

const eventRouter = Router();

eventRouter.get('/', getAllEventsController);

eventRouter.get('/:id', getEventByIdController);

eventRouter.post(
  '/',
  requireAuth,
  validate(createEventSchema),
  createEventController,
);

eventRouter.patch(
  '/:id',
  requireAuth,
  validate(updateEventSchema),
  updateEventController,
);

eventRouter.delete('/:id', requireAuth, deleteEventController);

export default eventRouter;
