import './utils/env.js';
import { setupServer } from './setupServer.js';
import { initMongoDB } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

console.log('Environment check:', {
  CLOUDINARY: process.env.CLOUDINARY_NAME ? 'loaded' : 'missing',
  MONGO_DB: process.env.MONGODB_DB ? 'loaded' : 'missing',
  SMTP: process.env.SMTP_USER ? 'configured' : 'missing',
});

const bootstrap = async () => {
  try {
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);
    await initMongoDB();
    await setupServer();
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

bootstrap();
