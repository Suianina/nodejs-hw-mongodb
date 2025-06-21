export const parsePaginationParams = ({ page = '1', perPage = '10' }) => ({
  page: Math.max(Number.parseInt(page) || 1, 1),
  perPage: Math.max(Number.parseInt(perPage) || 10, 1),
});
