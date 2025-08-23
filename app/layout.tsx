import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { LocaleProvider } from '@/components/providers/locale-provider'
import { Navigation } from '@/components/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'League of Legends Champions',
  description: 'Browse and search League of Legends champions with detailed information',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LocaleProvider>
          <QueryProvider>
            <Navigation />
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </QueryProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
