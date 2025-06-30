import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';
import { env } from '../utils/env.js';

const ACCESS_TOKEN_SECRET = env('ACCESS_TOKEN_SECRET');

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Missing Authorization header'));
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Invalid Authorization header'));
  }

  let payload;
  try {
    payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    return next(createHttpError(401, 'Invalid access token'));
  }

  const session = await Session.findOne({
    userId: payload.id,
    accessToken: token,
  });
  if (!session) return next(createHttpError(401, 'Session not found'));

  if (session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) return next(createHttpError(401, 'User not found'));

  req.user = user;
  next();
};
