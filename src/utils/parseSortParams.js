const parseSortBy = (value) => {
  if (typeof value !== 'string') {
    return '_id';
  }

  const keys = ['_id', 'name', 'createdAt'];
  return keys.includes(value) ? value : '_id';
};

const parseSortOrder = (value) => {
  if (typeof value !== 'string') {
    return 'asc';
  }

  return ['asc', 'desc'].includes(value) ? value : 'asc';
};

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
