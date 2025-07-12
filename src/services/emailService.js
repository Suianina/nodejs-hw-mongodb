import fs from 'node:fs/promises';
import path from 'node:path';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import { sendEmail } from '../utils/sendEmail.js';
import { UsersCollection } from '../db/models/user.js';
import {
  SMTP,
  JWT_SECRET,
  APP_DOMAIN,
  TEMPLATES_DIR,
} from '../constants/index.js';

export const sendResetPasswordEmail = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id.toString(),
      email,
    },
    JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    resetLink: `${APP_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: SMTP.FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const verifyResetToken = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (
      err instanceof jwt.TokenExpiredError ||
      err instanceof jwt.JsonWebTokenError
    ) {
      throw createHttpError(401, 'Token is expired or invalid');
    }
    throw createHttpError(401, 'Invalid token');
  }

  const user = await UsersCollection.findOne({
    email: decoded.email,
    _id: decoded.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  return user;
};
