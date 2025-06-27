import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(authControllers.register),
);
router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(authControllers.login),
);
router.post('/refresh', ctrlWrapper(authControllers.refresh));
router.post('/logout', ctrlWrapper(authControllers.logout));

export default router;
