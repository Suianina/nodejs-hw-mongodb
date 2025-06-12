import Contact from '../models/contact.js';

export function getAllContacts() {
  return Contact.find({});
}

export function getContactById(id) {
  return Contact.findById(id);
}

export function createContact(data) {
  return Contact.create(data);
}

export function updateContact(id, data) {
  return Contact.findByIdAndUpdate(id, data, { new: true });
}

export function deleteContact(id) {
  return Contact.findByIdAndDelete(id);
}

