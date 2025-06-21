export const getEnvVar = (key, defaultValue = undefined) => {
  const value = process.env[key];
  if (value !== undefined) return value;

  if (defaultValue !== undefined) return defaultValue;

  throw new Error(`Missing required environment variable: ${key}`);
};
