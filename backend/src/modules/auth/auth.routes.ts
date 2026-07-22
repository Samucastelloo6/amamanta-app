import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginController } from './auth.controller.js';
import { loginSchema } from './auth.validation.js';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), loginController);

export default authRouter;
