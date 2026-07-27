import { Router } from 'express';

import { getCollaborateInformationController } from './collaborate.controller.js';

const collaborateRouter = Router();

collaborateRouter.get('/', getCollaborateInformationController);

export default collaborateRouter;
