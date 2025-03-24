export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { email, first_name, last_name, password } = req.body;
  
    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BC_STORE_API}/customers`, {
        method: 'POST',
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_BC_ACCESS_TOKEN,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify([
          {
            email,
            first_name,
            last_name,
            authentication: {
              new_password: password,
            },
            accepts_product_review_abandoned_cart_emails: true,
            trigger_account_created_notification: true,
          },
        ]),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // ⚠️ Send clear error to frontend
        return res.status(response.status).json({
          error: data.errors?.[".customer_create"] || data.title || 'Registration failed',
          details: data,
        });
      }

  
      res.status(201).json(data);
      
      if (res.ok) {
        // ✅ Redirect to login page with a success flag
        window.location.href = '/auth/login?success=1';
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  