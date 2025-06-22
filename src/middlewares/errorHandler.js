import { HttpError } from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  if (error instanceof HttpError) {
    return res.status(error.status || 500).json({
      status: error.status || 500,
      message: error.message,
      ...(error.details && { errors: error.details }), // Додаємо деталі помилок
      data: null,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
    data: null,
  });
};
