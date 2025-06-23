import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

const phoneRegex = /^\+380\d{9}$/;

const baseSchema = {
  name: Joi.string().pattern(/[^\d]/).min(3).max(20).required().messages({
    'string.base': 'name should be a string',
    'string.pattern.base': 'name should not be a number',
    'string.min': 'name should have at least 3 characters',
    'string.max': 'name should have at most 20 characters',
    'any.required': 'name is required',
  }),

  phoneNumber: Joi.string().pattern(phoneRegex).required().messages({
    'string.pattern.base': 'phoneNumber must be a valid number',
    'any.required': 'phoneNumber is required',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'email must be a valid email',
    'any.required': 'email is required',
  }),

  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite should be a boolean',
  }),

  contactType: Joi.string()
    .valid(...typeList)
    .required()
    .messages({
      'any.only': 'contactType must be one of work, home, personal',
      'any.required': 'contactType is required',
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
