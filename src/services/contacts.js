import createHttpError from 'http-errors';
import Contact from '../models/contact.js';

export const getAllContacts = async (query = {}) => {
  const contacts = await Contact.find(query);
  if (!contacts.length) throw createHttpError(404, 'No contacts found!');
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) throw createHttpError(404, 'Contact not found!');
  return contact;
};

export const createContact = async (data) => {
  return Contact.create(data);
};

export const updateContact = async (id, data) => {
  const contact = await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!contact) throw createHttpError(404, 'Contact not found!');
  return contact;
};

export const deleteContact = async (id) => {
  const result = await Contact.findByIdAndDelete(id);
  if (!result) throw createHttpError(404, 'Contact not found!');
  return result;
};
