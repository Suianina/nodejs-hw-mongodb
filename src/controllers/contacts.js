import {
  addContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    const {
      data: contacts,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    } = await getAllContacts(
      { page, perPage, sortBy, sortOrder, filter },
      req.user._id,
    );

    if (page > totalPages && totalPages !== 0) {
      throw createHttpError(
        400,
        `Page ${page} does not exist. Total pages: ${totalPages}.`,
      );
    }

    const responseMessage =
      contacts.length === 0
        ? 'No contacts match the provided filters.'
        : 'Contacts retrieved successfully!';

    res.status(200).json({
      status: 200,
      message: responseMessage,
      data: {
        data: contacts,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: `Successfully found contact with ID ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const addContactController = async (req, res, next) => {
  try {
    const contact = await addContact({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      status: 201,
      message: 'Contact successfully created!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const updatedContact = await updateContact(
      contactId,
      req.body,
      req.user._id,
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found or not yours');
    }

    res.json({
      status: 200,
      message: 'Contact successfully updated!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const putContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const updatedContact = await updateContact(
      contactId,
      req.body,
      req.user._id,
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found or not yours');
    }

    res.json({
      status: 200,
      message: 'Contact successfully replaced!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found or not yours',
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Contact successfully deleted!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
