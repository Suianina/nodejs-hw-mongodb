import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoDB = async () => {
  try {
    const user = env('MONGODB_USER');
    const pwd = env('MONGODB_PASSWORD');
    const url = env('MONGODB_URL');
    const db = env('MONGODB_DB');

    console.log('Attempting to connect to MongoDB...');
    console.log(`URL: mongodb+srv://${user}:***@${url}/${db}`);

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      },
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error with setting up Mongo connection:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};
