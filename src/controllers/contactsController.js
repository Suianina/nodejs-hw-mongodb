import {
  parsePaginationParams,
  parseSortParams,
  parseFilterParams,
} from '../utils/index.js';

import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const handleGetAllContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const handleCreateContact = async (req, res) => {
  const newContact = await addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const handleUpdateContact = async (req, res) => {
  const { contactId } = req.params;

  const updatedContact = await updateContact(contactId, req.body);

  res.status(200).json({
    status: 200,
    message: `Successfully updated contact with id ${contactId}!`,
    data: updatedContact,
  });
};

export const handleDeleteContact = async (req, res) => {
  const { contactId } = req.params;

  await deleteContact(contactId);

  res.status(204).send();
};

