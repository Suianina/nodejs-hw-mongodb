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
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw createHttpError(
      500,
      'Missing ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET in environment',
    );
  }

  try {
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
  } catch (error) {
    console.error('❌ Token generation failed:', error);
    throw createHttpError(500, 'Token generation failed');
  }
};

export const registerService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 12);
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
  console.log('📥 Email:', email);
  console.log('📥 Password (length):', password?.length);

  const user = await User.findOne({ email }).select('+password');
  console.log('👤 User found:', !!user);

  if (!user || !user.password) {
    console.log('❌ Invalid email or missing password in DB');
    throw createHttpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log('🔐 Password match:', isMatch);

  if (!isMatch) {
    console.log('❌ Password does not match');
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });
  console.log('🧹 Old sessions deleted for user:', user._id.toString());

  const tokens = generateTokens(user._id);
  console.log(
    '🎟️ Tokens generated:',
    !!tokens.accessToken,
    !!tokens.refreshToken,
  );

  const session = await Session.create({ userId: user._id, ...tokens });
  console.log('💾 Session created with ID:', session._id.toString());

  return { ...tokens, sessionId: session._id.toString() };
};

export const refreshService = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'No refresh token');

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  const session = await Session.findOne({ userId: payload.id, refreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session expired');
  }

  await Session.deleteOne({ _id: session._id });

  const tokens = generateTokens(payload.id);
  const newSession = await Session.create({ userId: payload.id, ...tokens });

  return { ...tokens, sessionId: newSession._id.toString() };
};

export const logoutService = async (refreshToken) => {
  if (!refreshToken) return;
  await Session.findOneAndDelete({ refreshToken });
};
