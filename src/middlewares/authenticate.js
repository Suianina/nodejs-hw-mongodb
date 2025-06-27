import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { env } from '../utils/env.js';

const ACCESS_TOKEN_SECRET = env('ACCESS_TOKEN_SECRET');

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw createHttpError(401, 'User not found');

    req.user = user;
    next();
  } catch (err) {
    throw createHttpError(401, 'Access token expired');
  }
};
