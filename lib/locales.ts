// Locale constants
export const LOCALE = {
  US: 'en_US',
  VN: 'vi_VN'
} as const

// Type for locale values
export type LocaleValue = typeof LOCALE[keyof typeof LOCALE]

// Default locale
export const DEFAULT_LOCALE = LOCALE.US
