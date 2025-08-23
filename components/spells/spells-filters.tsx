'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Filter, X } from 'lucide-react'

interface SpellsFiltersProps {
  searchQuery: string
  selectedModes: string[]
  availableModes: string[]
  onSearchChange: (query: string) => void
  onModeToggle: (mode: string) => void
  onClearFilters: () => void
}

export function SpellsFilters({
  searchQuery,
  selectedModes,
  availableModes,
  onSearchChange,
  onModeToggle,
  onClearFilters,
}: SpellsFiltersProps) {
  const hasActiveFilters = searchQuery || selectedModes.length > 0

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search spells by name, description, or key..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mode Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Game Modes:
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Select Modes
                {selectedModes.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedModes.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
              sideOffset={8}
              align="end"
              side="bottom"
            >
              {availableModes.map((mode) => (
                <DropdownMenuCheckboxItem
                  key={mode}
                  checked={selectedModes.includes(mode)}
                  onCheckedChange={() => onModeToggle(mode)}
                >
                  {mode}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Selected Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Filters:
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedModes.map((mode) => (
              <Badge key={mode} variant="secondary" className="gap-1">
                {mode}
                <button
                  onClick={() => onModeToggle(mode)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
