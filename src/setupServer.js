import express from 'express';
import { env } from './utils/env.js';
import { initMongoDB } from './db/initMongoConnection.js';
import router from './routers/index.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cron from 'node-cron';
import { cleanupExpiredSessions } from './utils/cleanupSessions.js';
import { UPLOAD_DIR, TEMP_UPLOAD_DIR } from './constants/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupServer = async () => {
  const app = express();
  const PORT = Number(env('PORT', '3000'));

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: env('FRONTEND_ORIGIN', 'http://localhost:3000'),
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(logger);

  if (env('ENABLE_CLOUDINARY', 'false') === 'false') {
    app.use('/uploads', express.static(UPLOAD_DIR));
  }

  app.get('/', (_, res) => {
    res.json({ message: 'Contacts API is running 🚀' });
  });

  app.get('/auth/reset-password', (req, res) => {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('Missing token');
    }
    res.render('reset-password', { token });
  });

  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  await initMongoDB();

  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running session cleanup job...');
    await cleanupExpiredSessions();
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
    console.log('Configuration:');
    console.log('- FRONTEND_ORIGIN:', env('FRONTEND_ORIGIN'));
    console.log('- ENABLE_CLOUDINARY:', env('ENABLE_CLOUDINARY'));
    console.log(
      '- SMTP_USER:',
      env('SMTP_USER') ? 'configured' : 'not configured',
    );
  });
};
