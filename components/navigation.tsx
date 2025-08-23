'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLocale } from '@/components/providers/locale-provider'
import { LOCALE } from '@/lib/locales'
import { getLocaleCode, getLocaleUrl } from '@/lib/locale-utils'
import { getTranslations } from '@/lib/translations'
import { Globe } from 'lucide-react'
import { useMemo } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const { locale, toggleLocale } = useLocale()
  
  // Extract current locale code from pathname
  const currentLocaleCode = getLocaleCode(locale)
  const translations = getTranslations(locale)
  
  // Memoize navigation items to prevent unnecessary re-renders
  const navItems = useMemo(() => [
    { href: getLocaleUrl('/', currentLocaleCode), label: translations.navigation.home },
    { href: getLocaleUrl('/data', currentLocaleCode), label: 'Data' },
    { href: getLocaleUrl('/urf', currentLocaleCode), label: 'URF' },
    { href: getLocaleUrl('/runes-builds', currentLocaleCode), label: 'Runes Builds' },
  ], [currentLocaleCode, translations])

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href={getLocaleUrl('/', currentLocaleCode)} className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">LoL</span>
              </div>
              <span className="font-bold text-xl">League Stats</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    className={cn(
                      'transition-colors',
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLocale}
              className="flex items-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === LOCALE.US ? 'English' : 'Tiếng Việt'}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

