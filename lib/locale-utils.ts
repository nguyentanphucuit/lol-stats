import { LOCALE, LOCALE_CODES } from './locales'

export type LocaleCode = 'en' | 'vi'

/**
 * Extract locale code from locale value
 * @param locale - Locale value (e.g., 'en_US', 'vi_VN')
 * @returns Locale code (e.g., 'en', 'vi')
 */
export function getLocaleCode(locale: string): LocaleCode {
  return locale.split('_')[0] as LocaleCode
}

/**
 * Get locale value from locale code
 * @param code - Locale code (e.g., 'en', 'vi')
 * @returns Locale value (e.g., 'en_US', 'vi_VN')
 */
export function getLocaleFromCode(code: LocaleCode): string {
  return code === 'vi' ? LOCALE.VN : LOCALE.US
}

/**
 * Generate locale-aware URL
 * @param path - Path without locale (e.g., '/champions')
 * @param locale - Locale value or code
 * @returns Locale-aware URL (e.g., '/en/champions' or '/vi/champions')
 */
export function getLocaleUrl(
  path: string,
  locale: string | LocaleCode
): string {
  const code =
    typeof locale === 'string' && locale.includes('_')
      ? getLocaleCode(locale)
      : (locale as LocaleCode)

  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `/${code}${cleanPath}`
}

/**
 * Check if a path has a valid locale prefix
 * @param path - Path to check
 * @returns True if path has valid locale prefix
 */
export function hasLocalePrefix(path: string): boolean {
  const validCodes = Object.values(LOCALE_CODES)
  const segments = path.split('/').filter(Boolean)

  // Must have at least one segment and first segment must be a valid locale code
  if (segments.length === 0) return false

  const firstSegment = segments[0]
  return validCodes.includes(firstSegment as any)
}

/**
 * Remove locale prefix from path
 * @param path - Path with locale prefix
 * @returns Path without locale prefix
 */
export function removeLocalePrefix(path: string): string {
  if (path.startsWith('/en/')) return path.substring(4)
  if (path.startsWith('/vi/')) return path.substring(4)
  if (path === '/en' || path === '/vi') return '/'
  return path
}
