import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import { sendResetEmail, resetPassword } from '../controllers/resetPassword.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { resetEmailSchema, resetPwdSchema } from '../validation/reset.js'; // Змінено імпорт
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

authRouter.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(sendResetEmail),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPwdSchema),
  ctrlWrapper(resetPassword),
);

export default authRouter;
