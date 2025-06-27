import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { env } from './utils/env.js';
import { initMongoDB } from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = async () => {
  const app = express();
  const PORT = Number(env('PORT', '3000'));

  app.use(express.json());
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(logger);

  app.get('/', (req, res) => {
    res.json({ message: 'Contacts API is working' });
  });

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  await initMongoDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
