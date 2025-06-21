import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';
import Contact from '../models/contact.js';

export const isValidId = async (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, 'Invalid MongoDB ID');
  }

  const contactExists = await Contact.exists({ _id: contactId });
  if (!contactExists) {
    throw createHttpError(404, 'Contact not found');
  }

  next();
};
