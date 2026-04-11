'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { SystemSettingsProvider } from './providers/SystemSettingsProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SessionProvider>
        <SystemSettingsProvider>
          {children}
        </SystemSettingsProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
