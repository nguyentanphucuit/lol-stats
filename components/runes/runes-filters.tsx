'use client'

import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

interface RunesFiltersProps {
  searchQuery: string
  selectedStyles: string[]
  availableStyles: string[] | undefined
  onSearchChange: (value: string) => void
  onStyleToggle: (style: string) => void
  onClearFilters: () => void
}

export function RunesFilters({
  searchQuery,
  selectedStyles,
  availableStyles,
  onSearchChange,
  onStyleToggle,
  onClearFilters
}: RunesFiltersProps) {
  const hasActiveFilters = searchQuery || selectedStyles.length > 0

  const renderStylesDropdown = () => {
    if (!availableStyles) {
      return (
        <DropdownMenuLabel className="text-gray-500">
          Loading styles...
        </DropdownMenuLabel>
      )
    }

    if (availableStyles.length === 0) {
      return (
        <DropdownMenuLabel className="text-gray-500">
          No styles available
        </DropdownMenuLabel>
      )
    }

    return availableStyles.map((style) => (
      <DropdownMenuCheckboxItem
        key={style}
        checked={selectedStyles.includes(style)}
        onCheckedChange={() => onStyleToggle(style)}
      >
        {style}
      </DropdownMenuCheckboxItem>
    ))
  }

  const renderActiveFilters = () => {
    if (!hasActiveFilters) return null

    return (
      <div className="flex flex-wrap gap-2">
        {searchQuery && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: "{searchQuery}"
            <button
              onClick={() => onSearchChange('')}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {selectedStyles.map((style) => (
          <Badge key={style} variant="secondary" className="flex items-center gap-1">
            {style}
            <button
              onClick={() => onStyleToggle(style)}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Search & Filter</CardTitle>
        <CardDescription>
          Find runes by name or filter by their styles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search runes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Styles ({selectedStyles.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800" 
              sideOffset={8}
              align="end"
              side="bottom"
            >
              <DropdownMenuLabel>Filter by Styles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {renderStylesDropdown()}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClearFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {renderActiveFilters()}
      </CardContent>
    </Card>
  )
}
