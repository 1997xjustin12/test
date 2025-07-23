import { parse } from 'cookie';

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.bc_token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Optional: Validate token with BigCommerce API here

  return res.status(200).json({
    authenticated: true,
    token,
  });
}
