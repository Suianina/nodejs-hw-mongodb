import createHttpError from 'http-errors';

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const errors = error.details.map((err) => ({
      message: err.message,
      path: [err.path[0]],
      type: err.type,
      context: {
        label: err.context.label,
        value: err.context.value,
        key: err.context.key,
      },
    }));

    return next(
      createHttpError(400, 'BadRequestError', {
        details: errors,
      }),
    );
  }

  next();
};
