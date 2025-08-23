'use client'

import { useParams } from '@/hooks/useParams'
import { useChampions } from '@/hooks/useChampions'
import { ChampionsHeader } from '@/components/champions/champions-header'
import { ChampionsFilters } from '@/components/champions/champions-filters'
import { ChampionsResultsSummary } from '@/components/champions/champions-results-summary'
import { ChampionsTable } from '@/components/champions/champions-table'
import { ChampionsPagination } from '@/components/champions/champions-pagination'
import { ChampionsError } from '@/components/champions/champions-error'
import { Card, CardContent } from '@/components/ui/card'

export default function ChampionsPage() {
  const { 
    params, 
    updateSearch, 
    updateTags, 
    updatePage, 
    clearFilters, 
    toggleTag 
  } = useParams()

  // Use custom hook for champions data
  const { champions, tags, isLoading, error } = useChampions({
    page: params.page,
    limit: params.limit,
    q: params.q,
    tags: params.tags
  })

  if (error) {
    return <ChampionsError />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <ChampionsHeader />
        
        <ChampionsFilters
          searchQuery={params.q}
          selectedTags={params.tags}
          availableTags={tags}
          onSearchChange={updateSearch}
          onTagToggle={toggleTag}
          onClearFilters={clearFilters}
        />

        {champions && (
          <ChampionsResultsSummary
            currentPage={params.page}
            itemsPerPage={params.limit}
            totalItems={champions.total}
          />
        )}

        <Card>
          <CardContent className="p-0">
            <ChampionsTable
              champions={champions?.champions || []}
              isLoading={isLoading}
              itemsPerPage={params.limit}
            />
          </CardContent>
        </Card>

        {champions && champions.totalPages > 1 && (
          <ChampionsPagination
            currentPage={params.page}
            totalPages={champions.totalPages}
            onPageChange={updatePage}
          />
        )}
      </div>
    </div>
  )
}

