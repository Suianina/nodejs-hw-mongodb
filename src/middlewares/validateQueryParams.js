import createHttpError from 'http-errors';
import { typeList } from '../constants/contacts.js';

const validSortFields = ['_id', 'name', 'createdAt', 'isFavourite'];
const validSortOrders = ['asc', 'desc'];

export const validateQueryParams = (req, res, next) => {
  const { sortBy, sortOrder, type, isFavourite, email, page, perPage } =
    req.query;

  const errors = [];

  if (sortBy && !validSortFields.includes(sortBy)) {
    errors.push({
      message: `Invalid sortBy value: '${sortBy}'`,
      path: ['sortBy'],
      type: 'invalid.query.param',
    });
  }

  if (sortOrder && !validSortOrders.includes(sortOrder.toLowerCase())) {
    errors.push({
      message: `Invalid sortOrder value: '${sortOrder}'`,
      path: ['sortOrder'],
      type: 'invalid.query.param',
    });
  }

  if (type && !typeList.includes(type.toLowerCase())) {
    errors.push({
      message: `Invalid type value: '${type}'`,
      path: ['type'],
      type: 'invalid.query.param',
    });
  }

  if (isFavourite && !['true', 'false'].includes(isFavourite.toLowerCase())) {
    errors.push({
      message: `Invalid isFavourite value: '${isFavourite}'`,
      path: ['isFavourite'],
      type: 'invalid.query.param',
    });
  }

  if (email && typeof email !== 'string') {
    errors.push({
      message: `Invalid email value`,
      path: ['email'],
      type: 'invalid.query.param',
    });
  }

  const isPositiveInteger = (value) =>
    !isNaN(parseInt(value, 10)) && Number(value) > 0;

  if (page && !isPositiveInteger(page)) {
    errors.push({
      message: `Invalid page value: '${page}'`,
      path: ['page'],
      type: 'invalid.query.param',
    });
  }

  if (perPage && !isPositiveInteger(perPage)) {
    errors.push({
      message: `Invalid perPage value: '${perPage}'`,
      path: ['perPage'],
      type: 'invalid.query.param',
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid query parameters',
      data: {
        message: 'Bad request',
        errors,
      },
    });
  }

  next();
};
