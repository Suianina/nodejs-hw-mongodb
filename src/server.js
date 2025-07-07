import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import createHttpError from 'http-errors';

import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import router from './routers/index.js';
import { UPLOAD_DIR } from './constants/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(env('PORT', '3040'));

export const setupServer = () => {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(logger);

  app.get('/', (req, res) => {
    res.json({
      message: 'Contacts API is running',
    });
  });

  app.get('/reset-password', (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token) {
        throw createHttpError(400, 'Token is required');
      }
      res.render('reset-password', { token });
    } catch (error) {
      next(error);
    }
  });

  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return server;
};
