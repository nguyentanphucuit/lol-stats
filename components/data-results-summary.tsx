'use client'

interface DataResultsSummaryProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  itemName: string
}

export function DataResultsSummary({ 
  currentPage, 
  itemsPerPage, 
  totalItems, 
  itemName 
}: DataResultsSummaryProps) {
  if (totalItems === 0) return null
  
  const startItem = ((currentPage - 1) * itemsPerPage) + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  
  return (
    <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
      Showing {startItem} to {endItem} of {totalItems} {itemName}
    </div>
  )
}