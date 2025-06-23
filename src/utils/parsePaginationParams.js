import createHttpError from 'http-errors';

export const parsePaginationParams = (query) => {
  const errors = [];

  const parseNumber = (value, name, defaultValue) => {
    if (value === undefined) return defaultValue;

    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
      errors.push({
        message: `${name} must be a positive number`,
        path: [name],
        type: 'invalid.query.param',
      });
      return defaultValue;
    }

    return num;
  };

  const page = parseNumber(query.page, 'page', 1);
  const perPage = parseNumber(query.perPage, 'perPage', 10);

  if (errors.length > 0) {
    throw createHttpError(400, {
      message: 'Invalid pagination query parameters',
      errors,
    });
  }

  return { page, perPage };
};
