import { isHttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.isJoi) {
    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      details: err.details.map(({ path, message }) => ({ path, message })),
      requestId: req.id,
    });
  }

  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      requestId: req.id,
    });
  }

  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: 'Database error',
      details: err.message,
      requestId: req.id,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal server error',
    requestId: req.id,
  });
};
