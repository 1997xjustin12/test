import { backendHeaders, forwardRetryAfter, visitorBearer } from "@/app/lib/backend-headers";

export default async function handler(req, res) {
  // 1. Enforce GET method
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { product_id, page = 1 } = req.query;

  

  try {
    // 2. Ready Parameters
    const params = {page};
    if(product_id){
      params["product_id"] = product_id;
    }

    // 3. Construct URL with SearchParams (handles encoding automatically)
    const queryParams = new URLSearchParams(params);
    const targetUrl = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/reviews/list?${queryParams}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
      headers: backendHeaders(req),
    });
    forwardRetryAfter(response, res);

    // 4. Handle Non-JSON or Error Responses
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      const errorText = await response.text();
      return res.status(response.status || 500).json({ 
        message: 'Upstream did not return JSON', 
        raw: errorText 
      });
    }

    const data = await response.json();

    // Reviews are public, and the store-wide list is read by every home-page
    // view (BBQ's reviews section, Solana's hero rating). Let the CDN answer
    // repeat requests instead of calling the backend each time. Only for a
    // successful anonymous request: a signed-in visitor's call carries their
    // Bearer token and the backend may answer it differently.
    if (response.ok && !visitorBearer(req)) {
      res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    } else {
      res.setHeader("Cache-Control", "private, no-store");
    }

    // 5. Return upstream status and data
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ 
      message: 'Internal Proxy Error', 
      error: error.message 
    });
  }
}