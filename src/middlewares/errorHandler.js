import { HttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  console.error('❌ Error:', error);

  if (error.status) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
      ...(error.details && { errors: error.details }),
      data: null,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    data: null,
  });
};
