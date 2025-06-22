import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactsCollection.find();

  if (typeof filter.type !== 'undefined') {
    contactQuery.where('contactType').equals(filter.type);
  }

  if (typeof filter.isFavourite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [totalItems, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactQuery.getQuery()),
    contactQuery
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(perPage),
  ]);

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
