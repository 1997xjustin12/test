export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const {
      email,
      username,
      last_name,
      first_name,
      password,
      password2
    } = req.body;
  
    if (!email || !username || !first_name || !last_name || !password || !password2) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const response = await fetch(`https://admin.solanabbqgrills.com/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Api-Key ${process.env.NEXT_SOLANA_BACKEND_KEY}`,
          'X-Store-Domain': process.env.NEXT_PUBLIC_STORE_DOMAIN,
          'Accept': 'application/json',
        },
        body: JSON.stringify(
          {
            email,
            username,
            last_name,
            first_name,
            password,
            password2,
          }
        ),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return res.status(response.status).json({
          error: data,
        });
      }

  
      res.status(201).json(data);
      
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  