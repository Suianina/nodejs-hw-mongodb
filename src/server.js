import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { randomUUID } from 'node:crypto';

export default function setupServer() {
  const app = express();

  app.use((req, res, next) => {
    req.id = randomUUID();
    next();
  });

  app.use(pino());
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'Contacts API is running',
      timestamp: new Date(),
      requestId: req.id
    });
  });

  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

