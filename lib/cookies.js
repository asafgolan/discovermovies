import cookie from 'cookie';

export const setTokenCookie = (token,res) => {
  console.log('setTokenCookie', token);

  const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

  const cookieOptions = {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === 'production',
    path: "/",
  };

  const setCookie =  cookie.serialize('token', token, cookieOptions);
  res.setHeader('Set-Cookie', setCookie);

};


export const removeTokenCookie = (res) => {
  const val = cookie.serialize("token", "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", val);
};
