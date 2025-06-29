import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(authControllers.register),
);
authRouter.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(authControllers.login),
);
authRouter.post('/refresh', ctrlWrapper(authControllers.refresh));
authRouter.post('/logout', ctrlWrapper(authControllers.logout));

export default authRouter;
