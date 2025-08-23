'use client'

import { Card, CardContent } from '@/components/ui/card'
import { DataError } from '@/components/data-error'
import { DataHeader } from '@/components/data-header'
import { DataFilters } from '@/components/data-filters'
import { DataResultsSummary } from '@/components/data-results-summary'
import { DataPagination } from '@/components/data-pagination'
import { ChampionsTable } from '@/components/champions/champions-table'
import { ItemsTable } from '@/components/items/items-table'
import { RunesTable } from '@/components/runes/runes-table'
import { SpellsTable } from '@/components/spells/spells-table'

type Section = 'champions' | 'items' | 'runes' | 'spells' | 'stat-perks'

interface DataSectionProps {
  section: Section
  data: any
  tags: string[]
  isLoading: boolean
  error: any
  searchQuery: string
  selectedTags: string[]
  onSearchChange: (query: string) => void
  onTagToggle: (tag: string) => void
  onClearFilters: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
}

export function DataSection({
  section,
  data,
  tags,
  isLoading,
  error,
  searchQuery,
  selectedTags,
  onSearchChange,
  onTagToggle,
  onClearFilters,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage
}: DataSectionProps) {
  if (error) {
    const errorMessages = {
      champions: 'Failed to load champions. Please try again later.',
      items: 'Failed to load items. Please try again later.',
      runes: 'Failed to load runes. Please try again later.',
      spells: 'Failed to load spells. Please try again later.',
      'stat-perks': 'Failed to load stat perks. Please try again later.'
    }
    
    return (
      <DataError 
        message={errorMessages[section]}
        title="Error"
      />
    )
  }

  const renderHeader = () => {
    const headerData = {
      champions: {
        title: 'Champions',
        description: 'Explore the League of Legends champion roster'
      },
      items: {
        title: 'Items',
        description: 'Explore the League of Legends item shop'
      },
      runes: {
        title: 'Runes',
        description: 'Customize your build with the rune system'
      },
      spells: {
        title: 'Spells',
        description: 'Learn about spells and how to use them'
      },
      'stat-perks': {
        title: 'Stat Perks',
        description: 'Choose bonus stats to customize your champion'
      }
    }

    const { title, description } = headerData[section]
    return <DataHeader title={title} description={description} />
  }

  const renderFilters = () => {
    const filterData = {
      champions: {
        searchPlaceholder: 'Search champions...',
        tagLabel: 'Tags',
        description: 'Find champions by name or filter by their roles and tags'
      },
      items: {
        searchPlaceholder: 'Search items...',
        tagLabel: 'Tags',
        description: 'Find items by name or filter by their categories and tags'
      },
      runes: {
        searchPlaceholder: 'Search runes...',
        tagLabel: 'Styles',
        description: 'Find runes by name or filter by their styles'
      },
      spells: {
        searchPlaceholder: 'Search spells...',
        tagLabel: 'Modes',
        description: 'Find spells by name or filter by their game modes'
      },
      'stat-perks': {
        searchPlaceholder: 'Search stat perks...',
        tagLabel: 'Categories',
        description: 'Find stat perks by name or filter by their categories'
      }
    }

    const { searchPlaceholder, tagLabel, description } = filterData[section]
    
    return (
      <DataFilters
        searchQuery={searchQuery}
        selectedTags={selectedTags}
        availableTags={tags}
        onSearchChange={onSearchChange}
        onTagToggle={onTagToggle}
        onClearFilters={onClearFilters}
        searchPlaceholder={searchPlaceholder}
        tagLabel={tagLabel}
        description={description}
      />
    )
  }

  const renderResultsSummary = () => {
    if (!data) return null

    const itemNames = {
      champions: 'champions',
      items: 'items',
      runes: 'runes',
      spells: 'spells',
      'stat-perks': 'stat perks'
    }

    return (
      <DataResultsSummary
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={data.total}
        itemName={itemNames[section]}
      />
    )
  }

  const renderTable = () => {
    const items = data?.[section] || data?.champions || data?.items || data?.runes || data?.spells || []

    switch (section) {
      case 'champions':
        return (
          <ChampionsTable
            champions={items}
            isLoading={isLoading}
            itemsPerPage={itemsPerPage}
          />
        )
      case 'items':
        return (
          <ItemsTable
            items={items}
            isLoading={isLoading}
            itemsPerPage={itemsPerPage}
          />
        )
      case 'runes':
        return (
          <RunesTable
            runes={items}
            isLoading={isLoading}
            runesPerPage={itemsPerPage}
          />
        )
      case 'spells':
        return (
          <SpellsTable
            spells={items}
            isLoading={isLoading}
            spellsPerPage={itemsPerPage}
          />
        )
      case 'stat-perks':
        return (
          <div className="p-6 text-center text-gray-500">
            Stat perks table component will be implemented here
          </div>
        )
      default: return null
    }
  }

  const renderPagination = () => {
    if (!data || totalPages <= 1) return null

    return (
      <DataPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    )
  }

  return (
    <>
      {renderHeader()}
      {renderFilters()}
      {renderResultsSummary()}
      <Card>
        <CardContent className="p-0">
          {renderTable()}
        </CardContent>
      </Card>
      {renderPagination()}
    </>
  )
}
