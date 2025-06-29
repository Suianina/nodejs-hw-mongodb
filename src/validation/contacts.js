import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

const phoneRegex = /^\+380\d{9}$/;

const baseSchema = {
  name: Joi.string().pattern(/[^\d]/).min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.pattern.base': 'Name should not be a number',
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
    'string.pattern.base': 'Phone number must be in format +380XXXXXXXXX',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite must be true or false',
  }),
  contactType: Joi.string()
    .valid(...typeList)
    .required()
    .messages({
      'any.only': 'Contact type must be one of work, home, or personal',
      'any.required': 'Contact type is required',
    }),
};

export const createContactsSchema = Joi.object(baseSchema);

export const updateContactsSchema = Joi.object({
  ...baseSchema,
  name: baseSchema.name.optional(),
  phoneNumber: baseSchema.phoneNumber.optional(),
  email: baseSchema.email.optional(),
  isFavourite: baseSchema.isFavourite.optional(),
  contactType: baseSchema.contactType.optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
