export const setHttpOnlyCookie = (res, cookieName, cookieValue, maxAge) => {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: maxAge,
    secure: process.env.NODE_ENV !== 'development',
  });
};

export const clearHttpOnlyCookie = (res, cookieName, maxAge) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'Strict',
    maxAge: maxAge,
    secure: process.env.NODE_ENV !== 'development',
  });
};
