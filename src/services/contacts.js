import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = ContactsCollection.find();

  if (typeof filter.type !== 'undefined') {
    contactQuery.where('contactType').equals(filter.type);
  }

  if (typeof filter.isFavorite !== 'undefined') {
    contactQuery.where('isFavourite').equals(filter.isFavorite);
  }
  if (filter.userId || userId) {
    contactQuery.where('userId').equals(userId);
  }

  const [total, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page: page,
    perPage: perPage,
    totalItems: total,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const addContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, contact, userId) => {
  return ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    contact,
    { new: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};
