import {
  registerService,
  loginService,
  refreshService,
  logoutService,
} from '../services/auth.js';

export const register = async (req, res) => {
  const user = await registerService(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const login = async (req, res) => {
  const { accessToken, refreshToken } = await loginService(req.body);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const newAccessToken = await refreshService(refreshToken);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: newAccessToken },
  });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await logoutService(refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send();
};
