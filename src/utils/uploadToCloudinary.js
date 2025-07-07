import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: CLOUDINARY.NAME,
  api_key: CLOUDINARY.KEY,
  api_secret: CLOUDINARY.SECRET,
});

export const uploadToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};
