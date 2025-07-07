import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import * as authControllers from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(authControllers.registerUserController),
);
authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(authControllers.loginUserController),
);
authRouter.post(
  '/refresh',
  ctrlWrapper(authControllers.refreshSessionControllers),
);
authRouter.post('/logout', ctrlWrapper(authControllers.logoutControllers));
authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authControllers.requestResetEmailController),
);
authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authControllers.resetPasswordController),
);

export default authRouter;
