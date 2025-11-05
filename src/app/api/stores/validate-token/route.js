import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_SOLANA_BACKEND_URL || 'http://localhost:8000';
    const apiUrl = `${backendUrl}/api/stores/validate-token/`;
    
    console.log('[TOKEN VALIDATION] Calling Django backend:', apiUrl);
    
    // Forward the validation request to Django backend
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    console.log('[TOKEN VALIDATION] Backend response status:', response.status);
    console.log('[TOKEN VALIDATION] Response content-type:', response.headers.get('content-type'));

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[TOKEN VALIDATION] Backend returned non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { valid: false, error: 'Backend validation endpoint not available' },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log('[TOKEN VALIDATION] Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { valid: false, error: data.error || 'Token validation failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[TOKEN VALIDATION] API route error:', error);
    return NextResponse.json(
      { valid: false, error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
