import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import { initMongoDB } from './db/initMongoConnection.js';
import router from './routers/index.js';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cron from 'node-cron';
import { cleanupExpiredSessions } from './utils/cleanupSessions.js';

// 🔽 Додаткові змінні для ES-модулів
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupServer = async () => {
  const app = express();
  const PORT = Number(env('PORT', '3000'));

  // ✅ Підключаємо EJS
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use(
    cors({
      origin: env('FRONTEND_ORIGIN', 'http://localhost:3000'),
      credentials: true,
    }),
  );
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

  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running session cleanup job...');
    await cleanupExpiredSessions();
  });
};
