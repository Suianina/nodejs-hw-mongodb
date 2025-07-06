import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { env } from '../utils/env.js';

const ACCESS_TOKEN_SECRET = env('ACCESS_TOKEN_SECRET');
const REFRESH_TOKEN_SECRET = env('REFRESH_TOKEN_SECRET');

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const registerService = async ({ name, email, password }) => {
  console.log('🔐 REGISTER INPUT:', { name, email, password });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.warn('⚠️ Email already in use:', email);
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  console.log('🔐 HASHED PASSWORD:', hashedPassword);

  const user = await User.create({ name, email, password: hashedPassword });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw createHttpError(401, 'Invalid email or password');

  await Session.deleteMany({ userId: user._id });

  const tokens = generateTokens(user._id);
  const session = await Session.create({
    userId: user._id,
    ...tokens,
  });

  return {
    ...tokens,
    sessionId: session._id.toString(),
  };
};

export const refreshService = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'No refresh token');

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  const userId = payload.id;

  const session = await Session.findOne({ userId, refreshToken });
  if (!session) throw createHttpError(401, 'Invalid session');

  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const tokens = generateTokens(userId);
  const newSession = await Session.create({ userId, ...tokens });

  return {
    ...tokens,
    sessionId: newSession._id.toString(),
  };
};

export const logoutService = async (refreshToken) => {
  if (!refreshToken) return;

  await Session.findOneAndDelete({ refreshToken });
};
