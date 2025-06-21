import createHttpError from 'http-errors';

export const parsePaginationParams = ({ page = '1', perPage = '10' }) => ({
  page: Math.max(Number.parseInt(page) || 1, 1),
  perPage: Math.min(Math.max(Number.parseInt(perPage) || 10, 1), 100),
});

export const parseSortParams = ({ sortBy, sortOrder }) => ({
  sortBy: ['name', 'createdAt'].includes(sortBy) ? sortBy : 'name',
  sortOrder: ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc',
});

export const parseFilterParams = ({ type, isFavourite }) => {
  const allowedTypes = ['work', 'home', 'personal'];
  const parsedFilters = {};

  if (type && allowedTypes.includes(type.toLowerCase())) {
    parsedFilters.type = type.toLowerCase();
  }

  if (isFavourite !== undefined) {
    if (isFavourite === 'true') parsedFilters.isFavourite = true;
    else if (isFavourite === 'false') parsedFilters.isFavourite = false;
    else throw createHttpError(400, 'Invalid isFavourite value. Must be "true" or "false".');
  }

  return parsedFilters;
};
