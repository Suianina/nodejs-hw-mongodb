import {
  registerService,
  loginService,
  refreshService,
  logoutService,
} from '../services/auth.js';

const setupSessionCookies = (res, tokens) => {
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('sessionId', tokens.sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  const user = await registerService(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const login = async (req, res) => {
  const tokens = await loginService(req.body);

  setupSessionCookies(res, tokens);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: tokens.accessToken,
    },
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  const tokens = await refreshService(refreshToken);

  setupSessionCookies(res, tokens);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: tokens.accessToken,
    },
  });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await logoutService(refreshToken);

  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};
