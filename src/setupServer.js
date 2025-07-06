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
import { UPLOAD_DIR } from './constants/index.js'; // 🆕 додаємо UPLOAD_DIR

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const setupServer = async () => {
  const app = express();
  const PORT = Number(env('PORT', '3000'));

  // ✅ Підключаємо EJS для рендера reset-password форми
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // ✅ JSON + form-urlencoded
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ✅ CORS
  app.use(
    cors({
      origin: env('FRONTEND_ORIGIN', 'http://localhost:3000'),
      credentials: true,
    }),
  );

  app.use(cookieParser());
  app.use(logger);

  // ✅ Статичний доступ до /uploads (тільки якщо НЕ використовуєш Cloudinary)
  app.use('/uploads', express.static(UPLOAD_DIR)); // 🆕

  // 🌐 Тестовий маршрут
  app.get('/', (_, res) => {
    res.json({ message: 'Contacts API is running 🚀' });
  });

  // 📥 HTML-сторінка для скидання пароля
  app.get('/auth/reset-password', (req, res) => {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('Missing token');
    }

    res.render('reset-password', { token });
  });

  // 📦 Роути та обробка помилок
  app.use('/', router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  // ✅ Підключення до MongoDB
  await initMongoDB();

  // ✅ Запуск сервера
  app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
  });

  // 🧹 Щоденна очистка сесій
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running session cleanup job...');
    await cleanupExpiredSessions();
  });
};
