import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

import { authorizeWithGoogleOAuthValidationSchema } from '../validation/googleOAuthSchemas.js';
import * as authControllers from '../controllers/auth.js';
import * as googleAuthControllers from '../controllers/googleAuth.js';

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

authRouter.post(
  '/get-google-oauth-link',
  ctrlWrapper(googleAuthControllers.getGoogleOauthUrlController),
);

authRouter.post(
  '/authorize-with-google-oauth',
  validateBody(authorizeWithGoogleOAuthValidationSchema),
  ctrlWrapper(googleAuthControllers.authorizeWithGoogleController),
);

export default authRouter;
