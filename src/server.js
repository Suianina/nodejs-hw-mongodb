import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import { initMongoDB } from './db/initMongoConnection.js';
import router from './routers/index.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = async () => {
  const app = express();
  const PORT = Number(env('PORT', '3000'));

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(logger);

  app.get('/', (_, res) => {
    res.json({ message: 'Contacts API is running 🚀' });
  });

  app.use('/', router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  await initMongoDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
  });
};
