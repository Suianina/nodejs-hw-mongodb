export const parseFilterParams = ({ type, isFavourite }) => {
  const allowedTypes = ['work', 'home', 'personal'];
  return {
    type: allowedTypes.includes(type?.toLowerCase()) ? type.toLowerCase() : undefined,
    isFavourite: isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined,
  };
};
