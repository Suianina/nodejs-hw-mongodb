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

    return res.status(400).json({
      status: 400,
      message: 'BadRequestError',
      data: {
        message: 'Bad request',
        errors,
      },
    });
  }

  next();
};
