'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/components/providers/locale-provider'
import { getLocaleCode } from '@/lib/locale-utils'
import { getTranslations } from '@/lib/translations'

export default function LocaleHomePage() {
  const router = useRouter()
  const { locale } = useLocale()
  const currentLocaleCode = getLocaleCode(locale)
  const translations = getTranslations(locale)

  const handleGoToData = () => {
    router.push(`/${currentLocaleCode}/data`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {translations.home.title}
            </CardTitle>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {translations.home.subtitle}
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore the vast world of League of Legends with our detailed database. Find the perfect build, discover new strategies, and master your favorite champions.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                onClick={handleGoToData}
                className="min-w-[200px]"
              >
                Explore Data
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card>
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-2">🏆</div>
                  <h3 className="text-lg font-semibold mb-2">{translations.home.champions.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {translations.home.champions.description}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-2">⚔️</div>
                  <h3 className="text-lg font-semibold mb-2">{translations.home.items.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {translations.home.items.description}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-2">🔮</div>
                  <h3 className="text-lg font-semibold mb-2">{translations.home.runes.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {translations.home.runes.description}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-2">✨</div>
                  <h3 className="text-lg font-semibold mb-2">{translations.home.spells.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {translations.home.spells.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
