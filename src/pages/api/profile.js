export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/auth/profile`;

     // Read authorization header from the incoming request
    const authHeader = req.headers.authorization;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'X-Store-Domain': process.env.NEXT_PUBLIC_STORE_DOMAIN,
        ...(authHeader ? { Authorization: authHeader } : {}), // forward bearer token if exists
      },
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text(); // fallback
      return res.status(500).json({ message: 'Invalid JSON response', raw: text });
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Proxy request failed', error: error.message });
  }
}