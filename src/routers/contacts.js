import { Router } from 'express';
import * as contactControllers from '../controllers/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateQueryParams } from '../middlewares/validateQueryParams.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get(
  '/',
  validateQueryParams,
  ctrlWrapper(contactControllers.getContactsController),
);

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactsSchema),
  ctrlWrapper(async (req, res, next) => {
    const contact = await contactControllers.addContactController(
      {
        ...req,
        body: {
          ...req.body,
          userId: req.user._id,
          ...(req.file && { photo: req.file.path }),
        },
      },
      res,
      next,
    );

    return contact;
  }),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactsSchema),
  ctrlWrapper(async (req, res, next) => {
    const contact = await contactControllers.patchContactController(
      {
        ...req,
        params: req.params,
        body: {
          ...req.body,
          ...(req.file && { photo: req.file.path }),
        },
        user: req.user,
      },
      res,
      next,
    );

    return contact;
  }),
);

contactsRouter.put(
  '/:contactId',
  isValidId,
  validateBody(createContactsSchema),
  ctrlWrapper(contactControllers.putContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
