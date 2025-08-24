'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/components/providers/locale-provider'
import { getLocaleCode } from '@/lib/locale-utils'
import { getTranslations } from '@/lib/translations'
import { useStatPerks } from '@/hooks/useStatPerks'
import { useParams } from '@/hooks/useParams'
import { DataSection } from '@/components/data-section'
import { useState } from 'react'
import Image from 'next/image'

export default function StatPerksPage() {
  const { locale } = useLocale()
  const currentLocaleCode = getLocaleCode(locale)
  const translations = getTranslations(locale)

  const params = useParams()
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const { statPerks, categories, isLoading, error } = useStatPerks({
    page: params.params.page,
    limit: params.params.limit,
    q: params.params.q,
  })

  const handleSearchChange = (value: string) => {
    params.updateSearch(value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    params.updatePage(1) // Reset to first page when changing category
  }

  const clearFilters = () => {
    setSelectedCategory('')
    params.clearFilters()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Stat Shards
            </CardTitle>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose bonus stats to customize your champion's performance
            </p>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search stat perks..."
                  value={params.params.q}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  onClick={() => handleCategoryChange('')}
                  size="sm"
                >
                  All Categories
                </Button>
                {categories?.map(category => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? 'default' : 'outline'
                    }
                    onClick={() => handleCategoryChange(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters} size="sm">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {statPerks && (
          <div className="mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {statPerks.statPerks.length} of {statPerks.total} stat
              perks
              {selectedCategory && ` in category "${selectedCategory}"`}
            </p>
          </div>
        )}

        {/* Stat Perks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-48">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600">Failed to load stat perks</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statPerks?.statPerks.map((perk: any) => (
              <Card key={perk.id} className="h-48">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Stat Shard Icon from CommunityDragon */}
                    <div className="w-12 h-12 relative">
                      <Image
                        src={perk.iconUrl}
                        alt={`${perk.name} icon`}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                        onError={e => {
                          // Fallback to placeholder if CDragon image fails
                          const target = e.currentTarget as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML =
                              '<div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"><span class="text-2xl">⚡</span></div>'
                          }
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {perk.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {perk.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {statPerks && statPerks.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => params.updatePage(params.params.page - 1)}
                disabled={params.params.page === 1}
                size="sm"
              >
                Previous
              </Button>

              <span className="flex items-center px-4 text-sm text-gray-600 dark:text-gray-400">
                Page {params.params.page} of {statPerks.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => params.updatePage(params.params.page + 1)}
                disabled={params.params.page === statPerks.totalPages}
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
