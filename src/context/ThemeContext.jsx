import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const lightTheme = {
    dark: false,
    colors: {
      primary: '#FF6B00',
      secondary: '#FF9100',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#000000',
      textSecondary: '#666666',
      border: '#E5E5E5',
      inputBackground: '#F8F9FA',
      notification: '#FF6B00',
      tabInactive: '#BDBDBD',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
  };

  const darkTheme = {
    dark: true,
    colors: {
      primary: '#FF6B00',
      secondary: '#FF9100',
      background: '#121212',
      card: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      border: '#2C2C2C',
      inputBackground: '#2A2A2A',
      notification: '#FF6B00',
      tabInactive: '#757575',
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      info: '#2196F3',
      modalOverlay: 'rgba(0, 0, 0, 0.7)',
      shadow: 'rgba(0, 0, 0, 0.3)',
    },
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ colors: theme.colors, toggleTheme, isDarkMode, dark: theme.dark }}>
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
