import React, { createContext, useState, useCallback } from 'react';
import i18n from './i18n'; // Import the i18n instance directly

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language || 'en');

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};