<<<<<<< HEAD
import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    console.log('Loading swagger docs from:', SWAGGER_PATH);
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());
    console.log('Swagger docs loaded successfully');
    return [swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch (err) {
    console.error('Swagger load error:', err);
    console.error('Error details:', err.message);
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
=======
import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/index.js';

const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf-8'));
export { swaggerDoc };
>>>>>>> hw7-swagger
