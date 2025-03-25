'use client';

import { useSearchParams ,useRouter} from 'next/navigation';
import { useState,useEffect } from 'react';
import { useUserSession } from "@/app/context/session";
export default function LoginPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === '1';
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userSession, loadingSession } = useUserSession();


  useEffect(() => {
    if (userSession) {
      router.push('/my-account'); // Redirect to login if no session
    }
  }, [loadingSession , userSession,router]);

  if (loadingSession  || userSession) return null;

  const handleRegister = () => {
    router.push('/register');
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data)
    setLoading(false);

    if (res.ok && data?.token) {
      // Store token if needed (localStorage/cookies)
      // localStorage.setItem('bc_token', data.token);

      // Redirect or show success message
      window.location.href = '/my-account'; // Or wherever you want
    } else {
      setError(data?.error || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {success && (
          <p className="text-green-600 text-sm mb-4 text-center font-medium">
            🎉 Registration successful! Please log in.
          </p>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-lg transition-all ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-sm text-center mt-4 space-y-2">
          <a
            href="https://yourstore.com/login.php?action=reset_password"
            className="text-blue-600 hover:underline block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Forgot your password?
          </a>
          <p>
            Don’t have an account?{" "}
            <button
                type="button"
                onClick={handleRegister}
                className="text-blue-600 hover:underline"
              >
                Register here
              </button>
          </p>
        </div>
      </div>
    </div>
  );
}
