'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface SystemSettings {
  maintenanceMode: boolean;
  siteName?: string;
  slogan?: string;
  sessionTimeout?: string;
  [key: string]: any;
}

interface SystemSettingsContextType {
  settings: SystemSettings | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const SystemSettingsContext = createContext<SystemSettingsContextType>({
  settings: null,
  isLoading: true,
  refresh: async () => {},
});

export const useSystemSettings = () => useContext(SystemSettingsContext);

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/system');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('[SystemSettingsProvider] Error fetching settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SystemSettingsContext.Provider 
      value={{ 
        settings, 
        isLoading, 
        refresh: fetchSettings 
      }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
}
