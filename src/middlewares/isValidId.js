import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return next(
      createHttpError(400, {
        status: 400,
        message: 'Invalid ID format',
        errors: [
          {
            message: 'Invalid ID format',
            path: 'contactId',
            type: 'validation',
          },
        ],
      }),
    );
  }
  next();
};
