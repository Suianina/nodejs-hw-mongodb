import path from 'node:path';

export const typeList = ['work', 'home', 'personal'];

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const SEVEN_DAY = 7 * 24 * 60 * 60 * 1000;

export const SMTP = {
  HOST: process.env.SMTP_HOST,
  PORT: process.env.SMTP_PORT,
  USER: process.env.SMTP_USER,
  PASSWORD: process.env.SMTP_PASSWORD,
  FROM: process.env.SMTP_FROM,
};

export const JWT_SECRET = process.env.JWT_SECRET;
export const APP_DOMAIN = process.env.APP_DOMAIN;
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  NAME: process.env.CLOUDINARY_NAME,
  KEY: process.env.CLOUDINARY_KEY,
  SECRET: process.env.CLOUDINARY_SECRET,
};

export const ENABLE_CLOUDINARY = process.env.ENABLE_CLOUDINARY || 'false';

export const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

<<<<<<< HEAD
export const SWAGGER_PATH = path.resolve('docs/swagger.json');
=======
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
>>>>>>> hw7-swagger
