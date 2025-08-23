'use client'

interface SpellsResultsSummaryProps {
  currentPage: number
  spellsPerPage: number
  totalSpells: number
}

export function SpellsResultsSummary({
  currentPage,
  spellsPerPage,
  totalSpells,
}: SpellsResultsSummaryProps) {
  const startResult = (currentPage - 1) * spellsPerPage + 1
  const endResult = Math.min(currentPage * spellsPerPage, totalSpells)

  return (
    <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
      Showing {startResult} to {endResult} of {totalSpells} spells
    </div>
  )
}
