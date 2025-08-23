'use client'

import { useParams } from '@/hooks/useParams'
import { useRunes } from '@/hooks/useRunes'
import { RunesHeader } from '@/components/runes/runes-header'
import { RunesFilters } from '@/components/runes/runes-filters'
import { RunesResultsSummary } from '@/components/runes/runes-results-summary'
import { RunesTable } from '@/components/runes/runes-table'
import { RunesPagination } from '@/components/runes/runes-pagination'
import { RunesError } from '@/components/runes/runes-error'
import { Card, CardContent } from '@/components/ui/card'

export default function RunesPage() {
  const {
    params,
    updateSearch,
    updateTags: updateStyles,
    updatePage,
    clearFilters,
    toggleTag: toggleStyle
  } = useParams()

  // Use custom hook for runes data
  const { runes, styles, isLoading, error } = useRunes({
    page: params.page,
    limit: params.limit,
    q: params.q,
    styles: params.tags // Reusing tags for styles
  })

  // Debug: Log the current state
  console.log('RunesPage State:', {
    params,
    runes,
    styles,
    isLoading,
    error
  })

  if (error) {
    return <RunesError />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <RunesHeader />

        <RunesFilters
          searchQuery={params.q}
          selectedStyles={params.tags}
          availableStyles={styles}
          onSearchChange={updateSearch}
          onStyleToggle={toggleStyle}
          onClearFilters={clearFilters}
        />

        {runes && (
          <RunesResultsSummary
            currentPage={params.page}
            runesPerPage={params.limit}
            totalRunes={runes.total}
          />
        )}

        <Card>
          <CardContent className="p-0">
            <RunesTable
              runes={runes?.runes || []}
              isLoading={isLoading}
              runesPerPage={params.limit}
            />
          </CardContent>
        </Card>

        {runes && runes.totalPages > 1 && (
          <RunesPagination
            currentPage={params.page}
            totalPages={runes.totalPages}
            onPageChange={updatePage}
          />
        )}
      </div>
    </div>
  )
}
