import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createError from 'http-errors';

export async function handleGetAllContacts(req, res) {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function handleGetContactById(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function handleCreateContact(req, res) {
  const newContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

export async function handleUpdateContact(req, res) {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);
  if (!updatedContact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

export async function handleDeleteContact(req, res) {
  const { contactId } = req.params;
  const deleted = await deleteContact(contactId);
  if (!deleted) throw createError(404, 'Contact not found');

  res.status(204).send();
}
