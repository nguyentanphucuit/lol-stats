'use client'

import { useParams } from '@/hooks/useParams'
import { useItems } from '@/hooks/useItems'
import { ItemsHeader } from '@/components/items/items-header'
import { ItemsFilters } from '@/components/items/items-filters'
import { ItemsResultsSummary } from '@/components/items/items-results-summary'
import { ItemsTable } from '@/components/items/items-table'
import { ItemsPagination } from '@/components/items/items-pagination'
import { ItemsError } from '@/components/items/items-error'
import { Card, CardContent } from '@/components/ui/card'

export default function ItemsPage() {
  const { 
    params, 
    updateSearch, 
    updateTags, 
    updatePage, 
    clearFilters, 
    toggleTag 
  } = useParams()

  // Use custom hook for items data
  const { items, tags, isLoading, error } = useItems({
    page: params.page,
    limit: params.limit,
    q: params.q,
    tags: params.tags
  })

  if (error) {
    return <ItemsError />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <ItemsHeader />
        
        <ItemsFilters
          searchQuery={params.q}
          selectedTags={params.tags}
          availableTags={tags}
          onSearchChange={updateSearch}
          onTagToggle={toggleTag}
          onClearFilters={clearFilters}
        />

        {items && (
          <ItemsResultsSummary
            currentPage={params.page}
            itemsPerPage={params.limit}
            totalItems={items.total}
          />
        )}

        <Card>
          <CardContent className="p-0">
            <ItemsTable
              items={items?.items || []}
              isLoading={isLoading}
              itemsPerPage={params.limit}
            />
          </CardContent>
        </Card>

        {items && items.totalPages > 1 && (
          <ItemsPagination
            currentPage={params.page}
            totalPages={items.totalPages}
            onPageChange={updatePage}
          />
        )}
      </div>
    </div>
  )
}
