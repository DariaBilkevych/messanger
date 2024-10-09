export const setHttpOnlyCookie = (res, cookieName, cookieValue) => {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV !== 'development',
  });
};

export const clearHttpOnlyCookie = (res, cookieName) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV !== 'development',
  });
};
