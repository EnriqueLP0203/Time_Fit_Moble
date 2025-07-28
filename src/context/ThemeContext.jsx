import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lightTheme = {
    dark: false,
    colors: {
      primary: '#FF9100', // naranja
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      border: '#E5E5E5',
      notification: '#FF9100', // naranja
      tabInactive: '#BDBDBD',
    },
  };

  const darkTheme = {
    dark: true,
    colors: {
      primary: '#FF9100', // naranja
      background: '#000000',
      card: '#45474B',
      text: '#FFFFFF',
      border: '#38383A',
      notification: '#FF9100', // naranja
      tabInactive: '#757575',
    },
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
