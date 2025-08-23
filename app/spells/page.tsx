'use client'

import { useParams } from '@/hooks/useParams'
import { useSpells } from '@/hooks/useSpells'
import { Card, CardContent } from '@/components/ui/card'
import { SpellsHeader } from '@/components/spells/spells-header'
import { SpellsFilters } from '@/components/spells/spells-filters'
import { SpellsResultsSummary } from '@/components/spells/spells-results-summary'
import { SpellsTable } from '@/components/spells/spells-table'
import { SpellsPagination } from '@/components/spells/spells-pagination'
import { SpellsError } from '@/components/spells/spells-error'

export default function SpellsPage() {
  const { params, updateSearch, updateTags: updateModes, updatePage, clearFilters, toggleTag: toggleMode } = useParams()
  const { spells, modes, isLoading, error } = useSpells({
    page: params.page,
    limit: params.limit,
    q: params.q,
    modes: params.tags // Reusing tags for modes
  })

  if (error) {
    return <SpellsError />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <SpellsHeader />
        <SpellsFilters
          searchQuery={params.q}
          selectedModes={params.tags}
          availableModes={modes || []}
          onSearchChange={updateSearch}
          onModeToggle={toggleMode}
          onClearFilters={clearFilters}
        />
        {spells && (
          <SpellsResultsSummary
            currentPage={params.page}
            spellsPerPage={params.limit}
            totalSpells={spells.total}
          />
        )}
        <Card>
          <CardContent className="p-0">
            <SpellsTable
              spells={spells?.spells || []}
              isLoading={isLoading}
              spellsPerPage={params.limit}
            />
          </CardContent>
        </Card>
        {spells && spells.totalPages > 1 && (
          <SpellsPagination
            currentPage={params.page}
            totalPages={spells.totalPages}
            onPageChange={updatePage}
          />
        )}
      </div>
    </div>
  )
}
