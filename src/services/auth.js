import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import path from 'node:path';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getAuthInfo } from './googleAuth.js';

import {
  FIFTEEN_MINUTES,
  SEVEN_DAY,
  SMTP,
  JWT_SECRET,
  APP_DOMAIN,
  TEMPLATES_DIR,
} from '../constants/index.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
  };
};

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteMany({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    await SessionsCollection.deleteOne({ _id: sessionId });
    throw createHttpError(401, 'Session token expired');
  }

  const newSessionData = createSession();

  const updatedSession = await SessionsCollection.findOneAndUpdate(
    { _id: sessionId },
    {
      ...newSessionData,
      userId: session.userId,
    },
    { new: true, runValidators: true },
  );

  if (!updatedSession) {
    throw createHttpError(401, 'Session not found after update');
  }

  return updatedSession;
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
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

export const resetPassword = async ({ token, password }) => {
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

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionsCollection.deleteMany({ userId: user._id });
};

export const authorizeWithGoogleOauth = async (code) => {
  const googleUser = await getAuthInfo(code);

  if (!googleUser?.email) {
    throw createHttpError(401, 'Google user has no email');
  }

  let user = await UsersCollection.findOne({ email: googleUser.email });

  if (!user) {
    user = await UsersCollection.create({
      name: googleUser.name,
      email: googleUser.email,
      password: 'google_oauth_user',
    });
  }

  await SessionsCollection.deleteMany({ userId: user._id });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const findSession = (filter) => SessionsCollection.findOne(filter);
export const findUser = (filter) => UsersCollection.findOne(filter);
