const parseType = (type) => {
  if (typeof type !== 'string') {
    return undefined;
  }

  const validTypes = ['work', 'home', 'personal'];

  const isValidType = validTypes.includes(type.toLowerCase());

  return isValidType ? type.toLowerCase() : undefined;
};

const parseIsFavorite = (value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  if (value.toLowerCase() === 'true') {
    return true;
  } else if (value.toLowerCase() === 'false') {
    return false;
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavorite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
