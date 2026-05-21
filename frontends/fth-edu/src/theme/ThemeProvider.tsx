import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof darkColors;
}

const darkColors = {
  background: '#0a0a0f',
  surface: '#1a1a2e',
  surfaceHighlight: '#252542',
  primary: '#00ff88',
  secondary: '#D4AF37',
  accent: '#2563EB',
  text: '#ffffff',
  textMuted: '#888888',
  border: '#2a2a4e',
  error: '#ff4444',
  success: '#00ff88',
};

const lightColors = {
  background: '#f5f5f7',
  surface: '#ffffff',
  surfaceHighlight: '#f0f0f5',
  primary: '#00cc66',
  secondary: '#B8941F',
  accent: '#1d4ed8',
  text: '#1a1a2e',
  textMuted: '#666666',
  border: '#e0e0e0',
  error: '#cc0000',
  success: '#00cc66',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  colors: darkColors,
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    if (systemScheme) setTheme(systemScheme as Theme);
  }, [systemScheme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}
