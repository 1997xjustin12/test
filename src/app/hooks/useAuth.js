import { useState } from 'react';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const register = async (form) => {
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      return await res.json();
    } finally {
      setLoading(false);
    }
  };

  const login = async (customer_id) => {
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id }),
      });
      const data = await res.json();
      if (data.loginRedirect) {
        window.location.href = data.loginRedirect;
      } else {
        console.error('Login failed', data);
      }
    } finally {
      setLoading(false);
    }
  };

  return { register, login, loading };
};
