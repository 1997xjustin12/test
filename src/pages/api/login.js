export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
    const { email, redirect_to = '/' } = req.body;
  
    if (!email) return res.status(400).json({ error: 'Email is required' });
  
    try {
      // Step 1: Get customer ID by email
      const customerRes = await fetch(`${process.env.NEXT_PUBLIC_BC_STORE_API}/customers?email:in=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_BC_ACCESS_TOKEN,
          'Accept': 'application/json',
        },
      });
      console.log(customerRes)
      const customerData = await customerRes.json();
  
      if (!customerRes.ok || !customerData.data || customerData.data.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      const customerId = customerData.data[0].id;
  
      // Step 2: Create API Token (using your provided curl request)
      const tokenRes = await fetch(`https://api.bigcommerce.com/stores/${process.env.BC_STORE_HASH}/v3/storefront/api-token`, {
        method: 'POST',
        headers: {
          'X-Auth-Token': process.env.NEXT_PUBLIC_BC_ACCESS_TOKEN,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allowed_cors_origins: ['*'], // Set to your CORS origins as needed
          channel_id: 1, // Set the appropriate channel ID
          expires_at: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour, adjust as needed
        }),
      });
  
      // Debugging: Log the response text to inspect what is returned
      const textResponse = await tokenRes.text();
      console.log('Token response:', textResponse); // Log raw response text
  
      // Check if the response is OK
      if (!tokenRes.ok) {
        console.error('Error Response:', textResponse);
        return res.status(tokenRes.status).json({ error: 'Failed to generate token' });
      }
  
      let tokenData;
  
      // Try to parse the response as JSON
      try {
        tokenData = JSON.parse(textResponse);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        return res.status(500).json({ error: 'Failed to parse response', details: textResponse });
      }
  
      const token = tokenData.data.token;
      const loginRedirect = `https://bbqgrilloutlet.com/login/token/${token}`; // Update domain
  
      res.status(200).json({ loginRedirect });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  