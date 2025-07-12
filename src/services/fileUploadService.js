import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const uploadContactPhoto = async (file) => {
  if (!file) {
    return null;
  }

  try {
    const photoUrl = await uploadToCloudinary(file);
    return photoUrl;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
