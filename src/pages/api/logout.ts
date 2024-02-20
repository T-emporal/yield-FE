// pages/api/logout.js
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const clearAuthTokenCookie = serialize('session_token', '', {
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  // Clear the username cookie
  const clearUsernameCookie = serialize('username', '', {
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  res.setHeader('Set-Cookie', [clearAuthTokenCookie, clearUsernameCookie]);
  res.redirect('/login'); // Redirect to login page or wherever you prefer
}
