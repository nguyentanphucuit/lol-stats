import { redirect } from 'next/navigation'
import { LOCALE_CODES } from '@/lib/locales'

export default function RootPage() {
  // Redirect to default locale (English)
  redirect(`/${LOCALE_CODES.EN}`)
}
