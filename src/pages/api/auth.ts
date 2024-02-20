// pages/api/auth.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

interface User {
  username: string;
  password: string;
}

function createSessionToken(username: string): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  const userPart = Buffer.from(username).toString('base64');
  
  return `${userPart}-${randomPart}-${timestamp}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { username, password } = req.body;
  const usersData = process.env.USERS_JSON ? JSON.parse(process.env.USERS_JSON) : null;
  const users: User[] = usersData ? usersData.users : [];

  const userExists = users.some(user => user.username === username && user.password === password);

  if (userExists) {
    const sessionToken = createSessionToken(username);

    // Set the session token as a cookie
    res.setHeader('Set-Cookie', [
      serialize('session_token', sessionToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600 // 1 hour in seconds
      }),
      // Additional cookie for storing the username
      serialize('username', username, {
        path: '/',
        httpOnly: false, // Set to false to allow client-side JavaScript access if needed
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600 // Matching expiry time with the session token
      })
    ]);

    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
}
