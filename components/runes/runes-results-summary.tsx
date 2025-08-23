'use client'

interface RunesResultsSummaryProps {
  currentPage: number
  runesPerPage: number
  totalRunes: number
}

export function RunesResultsSummary({ currentPage, runesPerPage, totalRunes }: RunesResultsSummaryProps) {
  if (totalRunes === 0) return null

  const startRune = ((currentPage - 1) * runesPerPage) + 1
  const endRune = Math.min(currentPage * runesPerPage, totalRunes)

  return (
    <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
      Showing {startRune} to {endRune} of {totalRunes} runes
    </div>
  )
}
