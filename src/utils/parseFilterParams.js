import createHttpError from 'http-errors';

const parseContactType = (contactType) => {
  if (typeof contactType !== 'string') return undefined;
  const validTypes = ['work', 'home', 'personal'];
  return validTypes.includes(contactType.toLowerCase())
    ? contactType.toLowerCase()
    : undefined;
};

const parseIsFavourite = (value) => {
  if (typeof value !== 'string') return undefined;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  return undefined;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
  return {
    contactType: parseContactType(query.contactType),
    isFavourite: parseIsFavourite(query.isFavourite),
    email: parseEmail(query.email),
    phoneNumber:
      typeof query.phoneNumber === 'string'
        ? query.phoneNumber.trim()
        : undefined,
  };
};

export { parseContactType, parseIsFavourite, parseEmail, isValidEmail };
