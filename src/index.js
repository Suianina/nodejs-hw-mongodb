import { setupServer } from './server.js';
import { initMongoDB } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, TEMPLATES_DIR } from './constants/index.js';
import fs from 'fs';
import path from 'path';

const bootstrap = async () => {
  try {
    console.log('Starting application...');

    const requiredEnvVars = [
      'MONGODB_USER',
      'MONGODB_PASSWORD',
      'MONGODB_URL',
      'MONGODB_DB',
      'JWT_SECRET',
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName],
    );
    if (missingVars.length > 0) {
      console.error('Missing required environment variables:', missingVars);
      throw new Error(
        `Missing environment variables: ${missingVars.join(', ')}`,
      );
    }

    console.log('Environment variables check passed');

    await initMongoDB();
    console.log('MongoDB connection established');

    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(TEMPLATES_DIR);
    console.log('Directories created successfully');

    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
      console.log('Temp folder created');
    }
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
      console.log('Uploads folder created');
    }
    const gitkeepPath = path.join(uploadDir, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
      console.log('.gitkeep file created in uploads folder');
    }

    setupServer();
    console.log('Server setup completed');
  } catch (error) {
    console.error('Application startup failed:', error);
    process.exit(1);
  }
};

bootstrap();
