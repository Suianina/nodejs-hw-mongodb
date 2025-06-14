import createHttpError from 'http-errors';
import { MongooseError } from 'mongoose';

export default function errorHandler(err, req, res, next) {
  console.error(err);

  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: 'Database error',
      details: err.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    details: err.message,
  });
}
