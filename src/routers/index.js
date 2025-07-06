import { Router } from 'express';
import authRouter from './auth.js';
import contactsRouter from './contacts.js';

const apiRouter = Router();

// API routes versioning
apiRouter.use('/auth', authRouter);
apiRouter.use('/contacts', contactsRouter);

export default apiRouter;
