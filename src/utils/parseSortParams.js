export const parseSortParams = ({ sortBy, sortOrder }) => ({
  sortBy: ['name', 'createdAt'].includes(sortBy) ? sortBy : 'name',
  sortOrder: ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc',
});
