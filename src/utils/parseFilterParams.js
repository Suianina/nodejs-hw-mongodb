import createHttpError from 'http-errors';

const validTypes = ['work', 'home', 'personal'];

const parseContactType = (value) => {
  if (typeof value !== 'string') return undefined;
  const type = value.toLowerCase();
  return validTypes.includes(type) ? type : undefined;
};

const parseIsFavourite = (value) => {
  if (typeof value !== 'string') return undefined;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  return undefined;
};

const parseEmail = (value) => {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.trim().toLowerCase();
  if (cleaned === 'null') return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
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
  return {
    contactType: parseContactType(query.contactType),
    isFavourite: parseIsFavourite(query.isFavourite),
    email: parseEmail(query.email),
  };
};
