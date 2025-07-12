import { getGoogleOAuthUrl } from '../services/googleAuth.js';
import { authorizeWithGoogleOauth } from '../services/auth.js';
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

export const getGoogleOauthUrlController = (req, res) => {
  const url = getGoogleOAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully obtained Google auth URL!',
    data: {
      url,
    },
  });
};

export const authorizeWithGoogleController = async (req, res) => {
  const session = await authorizeWithGoogleOauth(req.body.code);

  sessionFunc(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in user with Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
