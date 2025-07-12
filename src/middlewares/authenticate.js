import createHttpError from 'http-errors';
import { findSession } from '../services/sessionService.js';
import { findUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  try {
    console.log('authenticate: req.cookies:', req.cookies);
    const { sessionId, refreshToken } = req.cookies;
    console.log(
      'authenticate: sessionId:',
      sessionId,
      'refreshToken:',
      refreshToken,
    );
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      return next(createHttpError(401, 'Authorization header missing'));
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      return next(
        createHttpError(401, 'Authorization header must be type Bearer'),
      );
    }

    const session = await findSession({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    if (Date.now() > new Date(session.accessTokenValidUntil).getTime()) {
      return next(createHttpError(401, 'Access token expired'));
    }

    const user = await findUser({ _id: session.userId });
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('authenticate: error:', error);
    next(error);
  }
};
