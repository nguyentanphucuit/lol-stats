'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useLocale } from '@/components/providers/locale-provider'
import { getLocaleCode } from '@/lib/locale-utils'
import { getTranslations } from '@/lib/translations'
import { useRuneTrees } from '@/hooks/useRuneTrees'
import { RuneTree } from '@/types'
import { runesService } from '@/lib/runes-service'
import Image from 'next/image'
import { Plus, Settings } from 'lucide-react'
import Link from 'next/link'

export default function RunesBuildsPage() {
  const { locale } = useLocale()
  const currentLocaleCode = getLocaleCode(locale)
  const translations = getTranslations(locale)
  const { runeTrees, isLoading, error } = useRuneTrees()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="h-96">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, slotIndex) => (
                        <div key={slotIndex}>
                          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                          <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, runeIndex) => (
                              <div key={runeIndex} className="h-3 bg-gray-300 rounded w-full"></div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">Failed to load rune trees</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header with action buttons */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 text-center">
                  <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Rune Trees
                  </CardTitle>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    The 5 main rune trees with their slots and runes
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Rune Trees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {runeTrees?.map((tree: RuneTree) => (
              <Card key={tree.id} className="max-w-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 relative rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Image
                        src={runesService.getRuneImageUrl(tree.icon)}
                        alt={`${tree.name} icon`}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', tree.icon, e)
                          // Show initials when image fails to load
                          const target = e.currentTarget as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-base">${tree.name.charAt(0)}</span>`
                          }
                        }}
                      />
                    </div>
                    <CardTitle className="text-base">{tree.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {tree.slots.map((slot, slotIndex: number) => (
                      <div key={slotIndex}>
                        <h4 className="font-medium text-xs text-gray-700 dark:text-gray-300 mb-1">
                          {slot.name}
                        </h4>
                        <div className="flex justify-between items-center">
                          {slot.runes.map((rune) => (
                            <Tooltip key={rune.id}>
                              <TooltipTrigger asChild>
                                <div className="w-10 h-10 relative flex-shrink-0 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-help hover:scale-110 transition-transform duration-200">
                                  <Image
                                    src={runesService.getRuneImageUrl(rune.icon)}
                                    alt={`${rune.name} icon`}
                                    width={48}
                                    height={48}
                                    className="rounded object-cover"
                                    onError={(e) => {
                                      console.error('Image failed to load:', rune.icon, e)
                                      // Show initials when image fails to load
                                      const target = e.currentTarget as HTMLImageElement
                                      target.style.display = 'none'
                                      const parent = target.parentElement
                                      if (parent) {
                                        parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-xs">${rune.name.charAt(0)}</span>`
                                      }
                                    }}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 relative">
                                      <Image
                                        src={runesService.getRuneImageUrl(rune.icon)}
                                        alt={`${rune.name} icon`}
                                        width={20}
                                        height={20}
                                        className="rounded object-cover"
                                      />
                                    </div>
                                    <p className="font-bold text-blue-600 dark:text-blue-400">{rune.name}</p>
                                  </div>
                                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{rune.shortDesc || 'No description available'}</p>
                                    {rune.longDesc && (
                                      <p className="text-xs text-gray-400 mt-1 italic">{rune.longDesc}</p>
                                    )}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </TooltipProvider>
  )
}
