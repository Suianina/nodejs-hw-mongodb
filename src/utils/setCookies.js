export const setAuthCookies = (res, tokens) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    domain: '.onrender.com', // тільки для продакшну!
  };

  res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

  res.cookie('accessToken', tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('sessionId', tokens.sessionId, cookieOptions);
};
