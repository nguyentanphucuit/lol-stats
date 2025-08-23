import { NextRequest, NextResponse } from 'next/server'
import { LOCALE, DEFAULT_LOCALE, LOCALE_CODES } from '@/lib/locales'
import { getLocaleCode, hasLocalePrefix } from '@/lib/locale-utils'

// List of supported locales
const locales = Object.values(LOCALE)
const defaultLocale = DEFAULT_LOCALE
const validLocaleCodes = Object.values(LOCALE_CODES)

// Get the preferred locale from the request
function getLocale(request: NextRequest): string {
  // Check if there's a locale in the URL path
  const pathname = request.nextUrl.pathname
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${getLocaleCode(locale)}`)
  )
  
  if (pathnameLocale) {
    return pathnameLocale
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim())
      .find((lang) => {
        if (lang.startsWith('vi')) return LOCALE.VN
        if (lang.startsWith('en')) return LOCALE.US
        return false
      })
    
    if (preferredLocale) {
      return preferredLocale.startsWith('vi') ? LOCALE.VN : LOCALE.US
    }
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if the pathname has a locale prefix
  if (hasLocalePrefix(pathname)) {
    // Validate that the locale code is correct
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 0 && validLocaleCodes.includes(segments[0] as any)) {
      // If we have a valid locale code, allow the request to proceed
      return
    }
  }

  // If we reach here, either there's no locale or an invalid locale
  // Redirect to the proper locale path
  const locale = getLocale(request)
  const localeCode = getLocaleCode(locale)
  
  // Handle root path specially
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${localeCode}`, request.url)
    )
  }

  // For invalid paths, redirect to the root of the proper locale
  return NextResponse.redirect(
    new URL(`/${localeCode}`, request.url)
  )
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
