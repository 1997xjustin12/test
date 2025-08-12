export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const response = await fetch('https://admin.solanabbqgrills.com/api/orders/get-total', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return res.status(500).json({ success: false, message: 'Invalid JSON response', raw: text });
    }

    const data = await response.json();

    return res.status(response.status).json({
      success: response.ok, 
      data,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ success: false, message: 'Proxy request failed', error: error.message });
  }
}
