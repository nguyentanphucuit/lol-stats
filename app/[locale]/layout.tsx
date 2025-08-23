import type { Metadata } from 'next'
import '../globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { LocaleProvider } from '@/components/providers/locale-provider'
import { LocaleWrapper } from '@/components/locale-wrapper'
import { Navigation } from '@/components/navigation'
import { LOCALE, LocaleValue } from '@/lib/locales'
import { getLocaleFromCode } from '@/lib/locale-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const localeValue = getLocaleFromCode(locale as 'en' | 'vi')
  const isVietnamese = localeValue === LOCALE.VN
  
  return {
    title: isVietnamese ? 'League of Legends Champions' : 'League of Legends Champions',
    description: isVietnamese 
      ? 'Browse and search League of Legends champions with detailed information'
      : 'Browse and search League of Legends champions with detailed information',
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeValue = getLocaleFromCode(locale as 'en' | 'vi') as LocaleValue

  return (
    <LocaleWrapper locale={localeValue}>
      <LocaleProvider key={localeValue} initialLocale={localeValue}>
        <QueryProvider>
          <Navigation />
          {children}
        </QueryProvider>
      </LocaleProvider>
    </LocaleWrapper>
  )
}
