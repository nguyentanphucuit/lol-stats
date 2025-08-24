'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useParams } from '@/hooks/useParams'
import { useChampions } from '@/hooks/useChampions'
import { useItems } from '@/hooks/useItems'
import { useRunes } from '@/hooks/useRunes'
import { useSpells } from '@/hooks/useSpells'
import { useStatPerks } from '@/hooks/useStatPerks'
import { useRuneTrees } from '@/hooks/useRuneTrees'
import { DataSection } from '@/components/data-section'
import { getTranslations } from '@/lib/translations'
import { useLocale } from '@/components/providers/locale-provider'
import { getLocaleCode } from '@/lib/locale-utils'

type Section =
  | 'champions'
  | 'items'
  | 'runes'
  | 'spells'
  | 'stat-perks'
  | 'runes-builds'

export default function DataPage() {
  const router = useRouter()
  const pathname = usePathname()
  const { locale } = useLocale()
  const translations = getTranslations(locale)
  const currentLocaleCode = getLocaleCode(locale)

  // Determine active section from URL
  const getActiveSection = (): Section => {
    if (pathname.includes('/champions')) return 'champions'
    if (pathname.includes('/items')) return 'items'
    if (pathname.includes('/runes')) return 'runes'
    if (pathname.includes('/spells')) return 'spells'
    if (pathname.includes('/stat-perks')) return 'stat-perks'
    if (pathname.includes('/runes-builds')) return 'runes-builds'
    return 'champions' // default
  }

  const activeSection = getActiveSection()

  const {
    params,
    updateSearch,
    updateTags,
    updatePage,
    clearFilters,
    toggleTag,
  } = useParams()

  // Use all the hooks
  const {
    champions,
    tags: championTags,
    isLoading: championsLoading,
    error: championsError,
  } = useChampions({
    page: params.page,
    limit: params.limit,
    q: params.q,
    tags: params.tags,
  })

  const {
    items,
    tags: itemTags,
    isLoading: itemsLoading,
    error: itemsError,
  } = useItems({
    page: params.page,
    limit: params.limit,
    q: params.q,
    tags: params.tags,
  })

  const {
    runes,
    styles,
    isLoading: runesLoading,
    error: runesError,
  } = useRunes({
    page: params.page,
    limit: params.limit,
    q: params.q,
    styles: params.tags,
  })

  const {
    spells,
    modes,
    isLoading: spellsLoading,
    error: spellsError,
  } = useSpells({
    page: params.page,
    limit: params.limit,
    q: params.q,
    modes: params.tags,
  })

  const {
    statPerks,
    categories,
    isLoading: statPerksLoading,
    error: statPerksError,
  } = useStatPerks({
    page: params.page,
    limit: params.limit,
    q: params.q,
  })

  const {
    runeTrees,
    isLoading: runeTreesLoading,
    error: runeTreesError,
  } = useRuneTrees()

  const handleSectionChange = (section: Section) => {
    const newPath = `/${currentLocaleCode}/data/${section}`
    router.push(newPath)
  }

  // Get the appropriate data, tags, loading state, and error for the active section
  const getSectionData = () => {
    switch (activeSection) {
      case 'champions':
        return {
          data: champions,
          tags: championTags || [],
          isLoading: championsLoading,
          error: championsError,
        }
      case 'items':
        return {
          data: items,
          tags: itemTags || [],
          isLoading: itemsLoading,
          error: itemsError,
        }
      case 'runes':
        return {
          data: runes,
          tags: styles || [],
          isLoading: runesLoading,
          error: runesError,
        }
      case 'spells':
        return {
          data: spells,
          tags: modes || [],
          isLoading: spellsLoading,
          error: spellsError,
        }
      case 'stat-perks':
        return {
          data: statPerks,
          tags: categories || [],
          isLoading: statPerksLoading,
          error: statPerksError,
        }
      case 'runes-builds':
        return {
          data: { runeTrees },
          tags: [],
          isLoading: runeTreesLoading,
          error: runeTreesError,
        }
      default:
        return {
          data: null,
          tags: [],
          isLoading: false,
          error: null,
        }
    }
  }

  const { data, tags, isLoading, error } = getSectionData()

  // Create appropriate callback for tag/style/mode toggling based on section
  const getTagToggleCallback = () => {
    switch (activeSection) {
      case 'champions':
      case 'items':
        return toggleTag
      case 'runes':
        return (tag: string) => {
          const newTags = params.tags.includes(tag)
            ? params.tags.filter(t => t !== tag)
            : [...params.tags, tag]
          updateTags(newTags)
        }
      case 'spells':
        return (tag: string) => {
          const newTags = params.tags.includes(tag)
            ? params.tags.filter(t => t !== tag)
            : [...params.tags, tag]
          updateTags(newTags)
        }
      case 'stat-perks':
        return (tag: string) => {
          const newTags = params.tags.includes(tag)
            ? params.tags.filter(t => t !== tag)
            : [...params.tags, tag]
          updateTags(newTags)
        }
      case 'runes-builds':
        return () => {} // No tag functionality for runes-builds
      default:
        return toggleTag
    }
  }

  const tagToggleCallback = getTagToggleCallback()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Section Navigation */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={activeSection === 'champions' ? 'default' : 'outline'}
            onClick={() => handleSectionChange('champions')}
            className="min-w-[120px]"
          >
            {translations.navigation?.champions || 'Champions'}
          </Button>
          <Button
            variant={activeSection === 'items' ? 'default' : 'outline'}
            onClick={() => handleSectionChange('items')}
            className="min-w-[120px]"
          >
            {translations.navigation?.items || 'Items'}
          </Button>
          <Button
            variant={activeSection === 'runes' ? 'default' : 'outline'}
            onClick={() => handleSectionChange('runes')}
            className="min-w-[120px]"
          >
            {translations.navigation?.runes || 'Runes'}
          </Button>
          <Button
            variant={activeSection === 'spells' ? 'default' : 'outline'}
            onClick={() => handleSectionChange('spells')}
            className="min-w-[120px]"
          >
            {translations.navigation?.spells || 'Spells'}
          </Button>
          <Button
            variant={activeSection === 'stat-perks' ? 'default' : 'outline'}
            onClick={() => handleSectionChange('stat-perks')}
            className="min-w-[120px]"
          >
            Stat Perks
          </Button>
          <Button
            variant={activeSection === 'runes-builds' ? 'default' : 'outline'}
            onClick={() => handleSectionChange('runes-builds')}
            className="min-w-[120px]"
          >
            Rune Trees
          </Button>
        </div>

        {/* Unified Data Section Component */}
        <DataSection
          section={activeSection}
          data={data}
          tags={tags}
          isLoading={isLoading}
          error={error}
          searchQuery={params.q}
          selectedTags={params.tags}
          onSearchChange={updateSearch}
          onTagToggle={tagToggleCallback}
          onClearFilters={clearFilters}
          currentPage={params.page}
          totalPages={data?.totalPages || 1}
          onPageChange={updatePage}
          itemsPerPage={params.limit}
        />
      </div>
    </div>
  )
}
