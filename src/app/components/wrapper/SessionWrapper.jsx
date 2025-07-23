'use client';
import { UserSessionProvider } from '@/app/context/session';

export default function SessionWrapper({ children }) {
  return (
    <UserSessionProvider>
      {children}
    </UserSessionProvider>
  );
}
