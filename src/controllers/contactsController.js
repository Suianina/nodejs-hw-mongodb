import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import Contact from '../models/contact.js';

const validateContactId = (contactId) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }
};

const validateRequiredFields = (data) => {
  const { name, phoneNumber, contactType } = data;
  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(400, 'Name, phoneNumber and contactType are required');
  }
};

const handleContactOperation = async (res, operation, successMessage) => {
  const result = await operation();
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: res.statusCode,
    message: successMessage,
    data: result,
  });
};

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    validateContactId(contactId);

    await handleContactOperation(
      res,
      () => Contact.findById(contactId),
      `Successfully found contact with id ${contactId}!`
    );
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    validateRequiredFields(req.body);

    const newContact = await Contact.create(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    validateContactId(contactId);

    await handleContactOperation(
      res,
      () => Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
        runValidators: true,
      }),
      'Successfully updated contact!'
    );
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    validateContactId(contactId);

    const deletedContact = await Contact.findByIdAndDelete(contactId);
    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
