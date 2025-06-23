import express, { json } from 'express';
import cors from 'cors';

import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';

const PORT = Number(env('PORT', '3040'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use(logger);

  app.get('/', (req, res) => {
    res.json({
      message: 'Contacts',
    });
  });

  app.use('/contacts', contactsRouter);
  // app.use('/contacts/:contactId', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
