import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../lib/translations/index'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Check local storage or default to English
    return localStorage.getItem('dvs-language') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('dvs-language', language)
    document.documentElement.lang = language
  }, [language])

  const t = (text) => {
    // If language is English or translation missing, return original text
    if (language === 'en') return text;
    if (translations[language] && translations[language][text]) {
      return translations[language][text];
    }
    // Fallback to Hindi if Santali translation is missing, or then to English
    if (language === 'sat' && translations['hi'] && translations['hi'][text]) {
      return translations['hi'][text];
    }
    return text;
  }

  const supportedLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' }
  ];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
