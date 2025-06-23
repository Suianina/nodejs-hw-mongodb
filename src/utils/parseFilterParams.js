import createHttpError from 'http-errors';

const parseType = (type) => {
  if (typeof type !== 'string') return undefined;

  const validTypes = ['work', 'home', 'personal'];
  return validTypes.includes(type.toLowerCase())
    ? type.toLowerCase()
    : undefined;
};

const parseIsFavorite = (value) => {
  if (typeof value !== 'string') return undefined;

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return undefined;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const parseEmail = (value) => {
  if (typeof value !== 'string') return undefined;

  const cleaned = value.trim().toLowerCase();

  if (cleaned === 'null') return null;

  if (!isValidEmail(cleaned)) {
    throw createHttpError(400, {
      message: 'Invalid email format',
      errors: [
        {
          message: `Invalid email value: '${value}'`,
          path: ['email'],
          type: 'invalid.query.param',
        },
      ],
    });
  }

  return cleaned;
};

export const parseFilterParams = (query) => {
  const typeValue = query.type || query.contactType;
  const isFavourite = query.isFavourite;
  const email = query.email;

  const parsedType = parseType(typeValue);
  const parsedIsFavourite = parseIsFavorite(isFavourite);
  const parsedEmail = parseEmail(email);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
    email: parsedEmail,
  };
};
