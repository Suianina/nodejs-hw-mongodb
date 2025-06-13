import createHttpError from 'http-errors';

export default function errorHandler(err, req, res, next) {
  console.error(err);

  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
  });
}
