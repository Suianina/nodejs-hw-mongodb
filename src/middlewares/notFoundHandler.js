import createHttpError from 'http-errors';

export default function notFoundHandler(req, res, next) {
  next(createHttpError(404, `Route ${req.method} ${req.originalUrl} not found`));
}
