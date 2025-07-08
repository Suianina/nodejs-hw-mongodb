import createHttpError from 'http-errors';
import mongoose from 'mongoose';

import {
  addContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createHttpError(400, 'Invalid contact ID format'));
  }

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContactController = async (req, res, next) => {
  try {
    console.log('addContactController: req.body:', req.body);
    console.log('addContactController: req.file:', req.file);
    const { _id: userId } = req.user;
    let photoUrl = null;
    if (req.file) {
      try {
        photoUrl = await uploadToCloudinary(req.file);
        console.log('addContactController: photoUrl after upload:', photoUrl);
      } catch (uploadErr) {
        console.error(
          'addContactController: Error uploading to Cloudinary:',
          uploadErr,
        );
        throw uploadErr;
      }
    }
    const data = {
      ...req.body,
      userId,
      photo: photoUrl,
    };
    console.log('addContactController: data to addContact:', data);
    const contact = await addContact(data);
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: contact,
    });
  } catch (error) {
    console.error('addContactController: Error:', error);
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user?._id;
    let photoUrl;
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file);
    }
    const updatedContact = await updateContact(
      contactId,
      {
        ...req.body,
        ...(photoUrl && { photo: photoUrl }),
      },
      userId,
    );
    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContact(contactId, userId);

  if (contact === null) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};
