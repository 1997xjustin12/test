export async function authFetch(url, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
