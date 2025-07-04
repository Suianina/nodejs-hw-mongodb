import path from 'node:path';

export const typeList = ['work', 'home', 'personal'];

export const ENABLE_CLOUDINARY = 'ENABLE_CLOUDINARY';

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const JWT_SECRET = 'JWT_SECRET';
export const APP_DOMAIN = 'APP_DOMAIN';
