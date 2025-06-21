import createHttpError from 'http-errors';
import Contact from '../models/contact.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder, filter }) => {
  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const query = {};
  if (filter.type) query.contactType = filter.type;
  if (filter.isFavourite !== undefined) query.isFavourite = filter.isFavourite;

  const totalItems = await Contact.countDocuments(query);
  const totalPages = Math.ceil(totalItems / perPage);


  const contacts = await Contact.find(query)
    .sort(sort)
    .skip(skip)
    .limit(perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) throw createHttpError(404, 'Contact not found!');
  return contact;
};

export const addContact = async (data) => {
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
