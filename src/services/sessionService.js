import { randomBytes } from 'crypto';
import { SessionsCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, SEVEN_DAY } from '../constants/index.js';

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
  };
};

export const createUserSession = async (userId) => {
  await SessionsCollection.deleteMany({ userId });

  const newSession = createSession();

  return await SessionsCollection.create({
    userId,
    ...newSession,
  });
};

export const findSession = (filter) => SessionsCollection.findOne(filter);

export const deleteUserSessions = async (userId) => {
  await SessionsCollection.deleteMany({ userId });
};

export const deleteSession = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
