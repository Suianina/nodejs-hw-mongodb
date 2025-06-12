import createError from 'http-errors';

export default function notFoundHandler(req, res, next) {
  next(createError(404, 'Route not found'));
}
