import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const details = error.details.map((err) => ({
      message: err.message,
      path: err.path,
      type: err.type,
    }));

    return next(
      createHttpError(400, 'Invalid request body', {
        details,
      }),
    );
  }

  next();
};
