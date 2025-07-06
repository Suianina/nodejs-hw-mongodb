import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env('CLOUDINARY_NAME'),
  api_key: env('CLOUDINARY_KEY'),
  api_secret: env('CLOUDINARY_SECRET'),
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    return result.secure_url;
  } finally {
    await fs.unlink(file.path);
  }
};
