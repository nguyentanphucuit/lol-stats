'use client'

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { APP_CONFIG } from '@/lib/constants'

interface RunesPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function RunesPagination({ currentPage, totalPages, onPageChange }: RunesPaginationProps) {
  const maxVisible = APP_CONFIG.MAX_VISIBLE_PAGES

  // Calculate which pages to show
  const calculatePageRange = () => {
    let startPage = 1
    let endPage = Math.min(maxVisible, totalPages)

    // If we're near the end, show pages from the end
    if (currentPage > totalPages - Math.floor(maxVisible / 2)) {
      startPage = Math.max(1, totalPages - maxVisible + 1)
      endPage = totalPages
    }
    // If we're near the beginning, show pages from the beginning
    else if (currentPage < Math.ceil(maxVisible / 2)) {
      startPage = 1
      endPage = Math.min(maxVisible, totalPages)
    }
    // If we're in the middle, center around current page
    else {
      startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
      endPage = Math.min(totalPages, startPage + maxVisible - 1)
    }

    return { startPage, endPage }
  }

  const renderPageNumbers = () => {
    const { startPage, endPage } = calculatePageRange()
    const pages = []

    // Add first page if not in range
    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(1)
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Add ellipsis if there's a gap
      if (startPage > 2) {
        pages.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-2 py-2 text-sm text-gray-500">...</span>
          </PaginationItem>
        )
      }
    }

    // Add visible page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(i)
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    // Add last page if not in range
    if (endPage < totalPages) {
      // Add ellipsis if there's a gap
      if (endPage < totalPages - 1) {
        pages.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-2 py-2 text-sm text-gray-500">...</span>
          </PaginationItem>
        )
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onPageChange(totalPages)
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pages
  }

  const handlePreviousPage = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = (e: React.MouseEvent) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={handlePreviousPage}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={handleNextPage}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
