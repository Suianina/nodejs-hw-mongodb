import Joi from 'joi';
import { typeList } from '../constants/index.js';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name should have at least 3 characters',
    'string.max': 'Name should have at most 20 characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().required().messages({
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...typeList)
    .required()
    .messages({
      'any.only': 'Contact type must be one of work, home, or personal',
      'any.required': 'Contact type is required',
    }),
  photo: Joi.any().optional(),
});

export const patchContactSchema = Joi.object({
  name: Joi.string(),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeList),
  photo: Joi.string(),
});
