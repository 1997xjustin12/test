// pages/api/create-cart.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { line_items } = req.body;
  
    if (!line_items || !Array.isArray(line_items)) {
      return res.status(400).json({ error: 'line_items array is required' });
    }
  
    try {
      // Step 1: Create the cart
      const cartRes = await fetch(
        `${process.env.NEXT_PUBLIC_BC_STORE_API}/carts`,
        {
          method: 'POST',
          headers: {
            'X-Auth-Token': process.env.NEXT_PUBLIC_BC_ACCESS_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ line_items }),
        }
      );
  
      const cartData = await cartRes.json();
  
      if (!cartRes.ok || !cartData.data?.id) {
        return res.status(cartRes.status).json({ error: cartData });
      }
  
      const cartId = cartData.data.id;
      console.log('cartid',cartId)
      // Step 2: Generate redirect URLs
      const redirectRes = await fetch(
        `${process.env.NEXT_PUBLIC_BC_STORE_API}/carts/${cartId}/redirect_urls`,
        {
          method: 'POST',
          headers: {
            'X-Auth-Token': process.env.NEXT_PUBLIC_BC_ACCESS_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
  
      const redirectData = await redirectRes.json();
  
      if (!redirectRes.ok || !redirectData.data?.checkout_url) {
        return res.status(redirectRes.status).json({ error: redirectData });
      }
  
      res.status(200).json({
        cart_id: cartId,
        checkout_url: redirectData.data.checkout_url,
        cart_url: redirectData.data.cart_url,
      });
    } catch (err) {
      console.error('Cart creation failed:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  