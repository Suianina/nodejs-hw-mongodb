import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { SEVEN_DAY } from '../constants/index.js';

const sessionFunc = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
  });
};

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  sessionFunc(res, session);

  res.json({
    status: 200,
    message: 'Successfully login user',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshSessionControllers = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshUserSession({ sessionId, refreshToken });

  sessionFunc(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutControllers = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await logoutUser(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  try {
    await resetPassword(req.body);
    res.json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    console.error('Error in resetPasswordController:', error);
    if (error.status && error.message) {
      res.status(error.status).json({
        status: error.status,
        message: error.message,
        data: null,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        data: null,
      });
    }
  }
};
