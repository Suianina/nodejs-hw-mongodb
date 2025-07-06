import { config } from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../.env') });

export const env = (name, defaultValue = null) => {
  const value = process.env[name];

  if (value !== undefined && value !== null && value !== '') {
    return value;
  }

  if (defaultValue !== null) {
    return defaultValue;
  }

  console.error(`❌ Missing required environment variable: ${name}`);
  throw new Error(
    `Missing required environment variable: ${name}. Check your .env file.`,
  );
};
