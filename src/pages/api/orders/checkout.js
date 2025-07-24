export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const response = await fetch('http://164.92.65.4:8800/api/orders/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
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
    console.error('Proxy Error:', error);
    return res.status(500).json({ message: 'Proxy request failed', error: error.message });
  }
}