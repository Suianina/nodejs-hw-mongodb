import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import fs from 'fs/promises';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env('CLOUDINARY_NAME'),
  api_key: env('CLOUDINARY_KEY'),
  api_secret: env('CLOUDINARY_SECRET'),
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts-photos',
    allowed_formats: ['jpg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

export const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return result.secure_url;
};
