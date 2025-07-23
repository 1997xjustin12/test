export default async function handler(req, res) {
    const API_URL = `${process.env.NEXT_PUBLIC_BC_STORE_API}/catalog/products/8645/images`;
    const API_TOKEN = process.env.NEXT_PUBLIC_BC_ACCESS_TOKEN;
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'X-Auth-Token': API_TOKEN,    
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching product images: ${response.statusText}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching product images:', error);
      res.status(500).json({ error: 'Failed to fetch product images' });
    }
  }