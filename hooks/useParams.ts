'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { APP_CONFIG } from '@/lib/constants'

export interface ChampionsParams {
  q: string
  tags: string[]
  maps: string[]
  page: number
  limit: number
}

export function useParams() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse current params from URL
  const params = useMemo<ChampionsParams>(
    () => ({
      q: searchParams.get('q') || '',
      tags: searchParams.getAll('tags'),
      maps: searchParams.getAll('maps'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(
        searchParams.get('limit') || APP_CONFIG.ITEMS_PER_PAGE.toString()
      ),
    }),
    [searchParams]
  )

  // Update URL with new params
  const updateParams = useCallback(
    (updates: Partial<ChampionsParams>) => {
      const newParams = new URLSearchParams(searchParams)

      // Update search query
      if (updates.q !== undefined) {
        if (updates.q) {
          newParams.set('q', updates.q)
        } else {
          newParams.delete('q')
        }
      }

      // Update tags
      if (updates.tags !== undefined) {
        newParams.delete('tags')
        updates.tags.forEach(tag => newParams.append('tags', tag))
      }

      // Update maps
      if (updates.maps !== undefined) {
        newParams.delete('maps')
        updates.maps.forEach(map => newParams.append('maps', map))
      }

      // Update page (reset to 1 when search/filter changes)
      if (updates.page !== undefined) {
        newParams.set('page', updates.page.toString())
      }

      // Update limit
      if (updates.limit !== undefined) {
        newParams.set('limit', updates.limit.toString())
      }

      // Reset page to 1 when search or filters change
      if (updates.q !== undefined || updates.tags !== undefined || updates.maps !== undefined) {
        newParams.set('page', '1')
      }

      const queryString = newParams.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.push(newUrl)
    },
    [searchParams, router, pathname]
  )

  // Individual update functions
  const updateSearch = useCallback(
    (q: string) => {
      updateParams({ q })
    },
    [updateParams]
  )

  const updateTags = useCallback(
    (tags: string[]) => {
      updateParams({ tags })
    },
    [updateParams]
  )

  const updateMaps = useCallback(
    (maps: string[]) => {
      updateParams({ maps })
    },
    [updateParams]
  )

  const updatePage = useCallback(
    (page: number) => {
      updateParams({ page })
    },
    [updateParams]
  )

  const clearFilters = useCallback(() => {
    updateParams({ q: '', tags: [], maps: [], page: 1 })
  }, [updateParams])

  const toggleTag = useCallback(
    (tag: string) => {
      const newTags = params.tags.includes(tag)
        ? params.tags.filter(t => t !== tag)
        : [...params.tags, tag]
      updateParams({ tags: newTags })
    },
    [params.tags, updateParams]
  )

  const toggleMap = useCallback(
    (map: string) => {
      const newMaps = params.maps.includes(map)
        ? params.maps.filter(m => m !== map)
        : [...params.maps, map]
      updateParams({ maps: newMaps })
    },
    [params.maps, updateParams]
  )

  return {
    params,
    updateSearch,
    updateTags,
    updateMaps,
    updatePage,
    clearFilters,
    toggleTag,
    toggleMap,
    updateParams,
  }
}
