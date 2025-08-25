"use client";

import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

interface DataFiltersProps {
  searchQuery: string;
  selectedTags: string[];
  availableTags: string[] | undefined;
  onSearchChange: (value: string) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
  searchPlaceholder: string;
  tagLabel: string;
  description: string;
}

export function DataFilters({
  searchQuery,
  selectedTags,
  availableTags,
  onSearchChange,
  onTagToggle,
  onClearFilters,
  searchPlaceholder,
  tagLabel,
  description,
}: DataFiltersProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        onSearchChange(localSearchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchQuery, onSearchChange]);

  // Update local search query when prop changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  const renderTagsDropdown = () => {
    if (!availableTags) {
      return (
        <DropdownMenuLabel className="text-gray-500">
          Loading tags...
        </DropdownMenuLabel>
      );
    }

    if (availableTags.length === 0) {
      return (
        <DropdownMenuLabel className="text-gray-500">
          No tags available
        </DropdownMenuLabel>
      );
    }

    return availableTags.map((tag) => (
      <DropdownMenuCheckboxItem
        key={tag}
        checked={selectedTags.includes(tag)}
        onCheckedChange={() => onTagToggle(tag)}
      >
        {tag}
      </DropdownMenuCheckboxItem>
    ));
  };

  const renderActiveFilters = () => {
    if (!hasActiveFilters) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {searchQuery && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: "{searchQuery}"
            <button
              onClick={() => onSearchChange("")}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => onTagToggle(tag)}
              className="ml-1 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Search & Filter</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={searchPlaceholder}
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {tagLabel} ({selectedTags.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
              sideOffset={8}
              align="end"
              side="bottom"
            >
              <DropdownMenuLabel>Filter by {tagLabel}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {renderTagsDropdown()}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {renderActiveFilters()}
      </CardContent>
    </Card>
  );
}
