import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('minimal'); // 'minimal' or 'engaged'

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'engaged') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => (prev === 'minimal' ? 'engaged' : 'minimal'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, isEngaged: mode === 'engaged' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
