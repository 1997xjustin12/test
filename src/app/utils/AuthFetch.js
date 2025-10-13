export async function authFetch(url, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    },
    cache: "no-store",
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("authFetch error:", error);
    throw error;
  }
}
