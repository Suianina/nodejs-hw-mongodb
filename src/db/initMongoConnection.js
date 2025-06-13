import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function initMongoConnection() {
  try {
    const uri = process.env.MONGODB_URI ||
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
}
