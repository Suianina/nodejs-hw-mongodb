import { Router } from 'express';
import * as contactControllers from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post(
  '/',
  validateBody(createContactsSchema),
  ctrlWrapper(contactControllers.addContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactsSchema),
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
