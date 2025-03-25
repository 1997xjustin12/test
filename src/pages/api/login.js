import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const query = `
    mutation Login($email: String!, $pass: String!) {
      login(email: $email, password: $pass) {
        result
        customer {
          entityId
          email
        }
        customerAccessToken {
          value
          expiresAt
        }
      }
    }
  `;

  const variables = { email, pass: password };
  const storeHash = process.env.BC_STORE_HASH || '3qyvevattr';
  const token = process.env.NEXT_BC_GRAPHQL_JWT_TOKEN;

  try {
    const response = await fetch(`https://bbqgrilloutlet.com/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (!response.ok || result.errors) {
      const errorMessage = result.errors?.[0]?.message || 'Login failed';
      return res.status(401).json({ error: errorMessage, details: result });
    }

    const { customer, customerAccessToken } = result.data.login;
    
    // ✅ Set token in HTTP-only cookie
    res.setHeader('Set-Cookie', serialize('bc_token', customerAccessToken.value, {
      httpOnly: true,
      secure: 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    }));

    const loginUrl = `https://store-${storeHash}.mybigcommerce.com/login/token/${customerAccessToken.value}`;

    return res.status(200).json({
      message: 'Login successful',
      customer,
      token: customerAccessToken.value,
      expiresAt: customerAccessToken.expiresAt,
      bigcommerceLoginUrl: loginUrl,
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
