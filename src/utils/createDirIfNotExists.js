import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url);
    console.log(`Directory already exists: ${url}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      try {
        await fs.mkdir(url, { recursive: true });
        console.log(`Directory created successfully: ${url}`);
      } catch (mkdirErr) {
        console.error(`Failed to create directory ${url}:`, mkdirErr.message);
        throw mkdirErr;
      }
    } else {
      console.error(`Error accessing directory ${url}:`, err.message);
      throw err;
    }
  }
};
