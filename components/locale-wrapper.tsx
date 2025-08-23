'use client'

import { useEffect } from 'react'
import { LOCALE, LocaleValue, LANGUAGE_CODES } from '@/lib/locales'

interface LocaleWrapperProps {
  children: React.ReactNode
  locale: LocaleValue
}

export function LocaleWrapper({ children, locale }: LocaleWrapperProps) {
  useEffect(() => {
    // Update document lang attribute when locale changes
    document.documentElement.lang = LANGUAGE_CODES[locale]
  }, [locale])

  // Always render children immediately to prevent loading states
  return <>{children}</>
}
