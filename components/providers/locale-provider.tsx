'use client'

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LOCALE, LocaleValue } from '@/lib/locales'
import { getLocaleCode } from '@/lib/locale-utils'

export type Locale = LocaleValue

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

interface LocaleProviderProps {
  children: ReactNode
  initialLocale: Locale
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const router = useRouter()
  const pathname = usePathname()

  const setLocale = useCallback((newLocale: Locale) => {
    if (newLocale === locale) return // Prevent unnecessary updates
    
    setLocaleState(newLocale)
    
    // Update URL to reflect new locale
    const currentLocaleCode = getLocaleCode(locale)
    const newLocaleCode = getLocaleCode(newLocale)
    
    if (pathname && currentLocaleCode !== newLocaleCode) {
      const newPath = pathname.replace(`/${currentLocaleCode}`, `/${newLocaleCode}`)
      router.push(newPath)
    }
  }, [locale, pathname, router])

  const toggleLocale = useCallback(() => {
    const newLocale = locale === LOCALE.US ? LOCALE.VN : LOCALE.US
    setLocale(newLocale)
  }, [locale, setLocale])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    locale,
    setLocale,
    toggleLocale
  }), [locale, setLocale, toggleLocale])

  return (
    <LocaleContext.Provider value={contextValue}>
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
