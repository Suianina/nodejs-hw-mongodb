import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function initMongoConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
}
