'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserSession } from "@/app/context/session";
export default function MyAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success') === '1';
  const { userSession, loading } = useUserSession();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!loading && !userSession) {
      router.push('/login'); // Redirect to login if no session
    }
  }, [loading, userSession, router]);

  if (loading || !userSession) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Your account content here */}
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-xl font-bold">Welcome to your account</h1>
        {success && <p className="text-green-600 mt-2">Action was successful!</p>}
      </div>
    </div>
  );
}
