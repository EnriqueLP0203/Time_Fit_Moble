import React, { createContext, useState, useContext } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };        

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      background: '#121212',
      card: '#121212',
      text: '#FFFFFF',
      border: '#2D2D2D',
      primary: '#FF6B6B',
      tabInactive: '#808080',
    } : {
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: '#E0E0E0',
      primary: '#FF6B6B',
      tabInactive: '#666666',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
