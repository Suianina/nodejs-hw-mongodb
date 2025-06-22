import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;

  const filterQuery = {};
  if (typeof filter.type !== 'undefined') {
    filterQuery.contactType = filter.type;
  }
  if (typeof filter.isFavourite !== 'undefined') {
    filterQuery.isFavourite = filter.isFavourite;
  }

  const totalItems = await ContactsCollection.countDocuments(filterQuery);

  const contacts = await ContactsCollection.find(filterQuery)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const addContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};

export const updateContact = async (contactId, contact) => {
  return await ContactsCollection.findByIdAndUpdate(contactId, contact, {
    new: true,
  });
};

export const deleteContact = async (contactId) => {
  return await ContactsCollection.findByIdAndDelete(contactId);
};
