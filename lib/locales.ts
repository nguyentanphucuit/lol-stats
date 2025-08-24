// Locale constants
export const LOCALE_CODES = {
  EN: 'en',
  VI: 'vi',
} as const

export const LOCALE = {
  US: 'en_US',
  VN: 'vi_VN',
} as const

// Language codes for HTML lang attributes
export const LANGUAGE_CODES = {
  [LOCALE.US]: LOCALE_CODES.EN,
  [LOCALE.VN]: LOCALE_CODES.VI,
} as const

// Type for locale values
export type LocaleValue = (typeof LOCALE)[keyof typeof LOCALE]
export type LocaleCode = (typeof LOCALE_CODES)[keyof typeof LOCALE_CODES]

// Default locale
export const DEFAULT_LOCALE = LOCALE.US
