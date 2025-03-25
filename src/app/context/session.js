'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const UserSessionContext = createContext(null);

export const useUserSession = () => useContext(UserSessionContext);

export const UserSessionProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const getSession = async () => {
    try {
      const res = await fetch('/api/session');
      if (!res.ok) throw new Error("Not logged in");
      const data = await res.json();
      setUserSession(data);
    } catch {
      setUserSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  return (
    <UserSessionContext.Provider value={{ userSession, loading }}>
      {children}
    </UserSessionContext.Provider>
  );
};
