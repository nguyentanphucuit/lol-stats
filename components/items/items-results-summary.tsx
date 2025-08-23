'use client'

interface ItemsResultsSummaryProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
}

export function ItemsResultsSummary({ currentPage, itemsPerPage, totalItems }: ItemsResultsSummaryProps) {
  if (totalItems === 0) return null
  
  const startItem = ((currentPage - 1) * itemsPerPage) + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  return (
    <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
      Showing {startItem} to {endItem} of {totalItems} items
    </div>
  )
}
