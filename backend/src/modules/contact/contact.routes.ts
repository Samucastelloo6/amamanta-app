import { Router } from 'express';

import { getContactInformationController } from './contact.controller.js';

const contactRouter = Router();

contactRouter.get('/', getContactInformationController);

export default contactRouter;
