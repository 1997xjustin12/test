export default async function handler(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "Missing access token" });
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BC_STORE_API}/customers/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch customer");
      }
  
      const data = await response.json();
      return res.status(200).json(data.data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  