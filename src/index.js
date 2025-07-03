import './utils/env.js';
import { setupServer } from './setupServer.js';

console.log('Environment check:', {
  CLOUDINARY: process.env.CLOUDINARY_CLOUD_NAME ? 'loaded' : 'missing',
  MONGO_DB: process.env.MONGODB_DB ? 'loaded' : 'missing',
});

const bootstrap = async () => {
  await setupServer();
};

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
