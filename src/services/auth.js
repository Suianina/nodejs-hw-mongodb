import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { sendResetPasswordEmail, verifyResetToken } from './emailService.js';
import {
  createUserSession,
  deleteUserSessions,
  deleteSession,
  createSession,
} from './sessionService.js';
import { getAuthInfo } from './googleAuth.js';

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

  return await createUserSession(user._id);
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
  await deleteSession(sessionId);
};

export const requestResetToken = async (email) => {
  await sendResetPasswordEmail(email);
};

export const resetPassword = async ({ token, password }) => {
  const user = await verifyResetToken(token);

  const encryptedPassword = await bcrypt.hash(password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await deleteUserSessions(user._id);
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

  return await createUserSession(user._id);
};

export const findUser = (filter) => UsersCollection.findOne(filter);
