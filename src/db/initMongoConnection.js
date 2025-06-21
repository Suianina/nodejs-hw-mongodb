import mongoose from 'mongoose';
import { getEnvVar } from '../utils/getEnvVar.js';
import { ENV_VARS } from '../constants/envVars.js';

export default async function initMongoConnection() {
  const uri = `mongodb+srv://${getEnvVar(ENV_VARS.MONGODB_USER)}:${getEnvVar(ENV_VARS.MONGODB_PASSWORD)}@${getEnvVar(ENV_VARS.MONGODB_URL)}/${getEnvVar(ENV_VARS.MONGODB_DB)}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}
