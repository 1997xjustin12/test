import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the bc_token cookie by setting an expired date
  res.setHeader('Set-Cookie', serialize('bc_token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }));

  return res.status(200).json({ message: 'Logged out successfully' });
}
