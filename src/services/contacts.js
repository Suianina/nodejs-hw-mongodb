import Contact from '../models/contact.js';

export const getAllContacts = async (query = {}) => {
  return Contact.find(query);
};

export const getContactById = async (id) => {
  return Contact.findById(id);
};

export const createContact = async (data) => {
  return Contact.create(data);
};

export const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};

