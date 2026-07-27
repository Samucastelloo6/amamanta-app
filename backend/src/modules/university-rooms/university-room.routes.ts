import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createUniversityRoomController,
  deleteUniversityRoomController,
  getAllUniversityRoomsController,
  getUniversityRoomByIdController,
  updateUniversityRoomController,
} from './university-room.controller.js';
import {
  createUniversityRoomSchema,
  updateUniversityRoomSchema,
} from './university-room.validation.js';

const universityRoomRouter = Router();

universityRoomRouter.get('/', getAllUniversityRoomsController);

universityRoomRouter.get('/:id', getUniversityRoomByIdController);

universityRoomRouter.post(
  '/',
  requireAuth,
  validate(createUniversityRoomSchema),
  createUniversityRoomController,
);

universityRoomRouter.patch(
  '/:id',
  requireAuth,
  validate(updateUniversityRoomSchema),
  updateUniversityRoomController,
);

universityRoomRouter.delete(
  '/:id',
  requireAuth,
  deleteUniversityRoomController,
);

export default universityRoomRouter;
