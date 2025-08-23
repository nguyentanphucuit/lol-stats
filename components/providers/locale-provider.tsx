'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LOCALE, LocaleValue, DEFAULT_LOCALE } from '@/lib/locales'

export type Locale = LocaleValue

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    // Load saved locale from localStorage on mount
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === LOCALE.US || savedLocale === LOCALE.VN)) {
      setLocaleState(savedLocale)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  const toggleLocale = () => {
    const newLocale = locale === LOCALE.US ? LOCALE.VN : LOCALE.US
    setLocale(newLocale)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
