import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { env } from './utils/env.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';
import { swaggerDoc } from './middlewares/swaggerDocs.js';
import router from './routers/index.js';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUI from 'swagger-ui-express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(express.json());
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

  app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDoc);
  });

  app.get('/redoc', (req, res) => {
    const html = fs.readFileSync(
      path.join(__dirname, '../docs/index.html'),
      'utf8',
    );
    res.send(html);
  });

  app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(logger);

  app.get('/confirm-google-auth', (req, res) => {
    console.log('Google OAuth callback route hit!');
    console.log('Query params:', req.query);

    const { code } = req.query;

    if (!code) {
      console.log('No code found in query');
      return res.status(400).send('Code not found in query');
    }

    console.log('Code found:', code);
    res.send(`
      <h1>Google OAuth Code</h1>
      <p>Copy this code and paste it into the request <code>POST /auth/authorize-with-google-oauth</code></p>
      <code>${code}</code>
    `);
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Contacts API is running' });
  });

  app.use('/', router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return server;
};
