'use client'

import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Rune } from '@/types'
import { runesService } from '@/lib/runes-service'
import { APP_CONFIG } from '@/lib/constants'

interface RunesTableProps {
  runes: Rune[]
  isLoading: boolean
  runesPerPage: number
}

export function RunesTable({ runes, isLoading, runesPerPage }: RunesTableProps) {
  const renderLoadingSkeletons = () => {
    const imageSize = APP_CONFIG.CHAMPION_IMAGE_SIZE
    const imageSizeClass = `w-${imageSize/4} h-${imageSize/4}`

    return Array.from({ length: runesPerPage }).map((_, i) => (
      <TableRow key={`runes-skeleton-${i}`}>
        <TableCell>
          <div className={`${imageSizeClass} rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
            <Skeleton className={`${imageSizeClass} rounded-md`} />
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-32" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-48" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-24" />
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </TableCell>
      </TableRow>
    ))
  }

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-8">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">No runes found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </TableCell>
    </TableRow>
  )

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderLoadingSkeletons()}
        </TableBody>
      </Table>
    )
  }

  if (!runes || runes.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Style</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderEmptyState()}
        </TableBody>
      </Table>
    )
  }

  const imageSize = APP_CONFIG.CHAMPION_IMAGE_SIZE
  const imageSizeClass = `w-${imageSize/4} h-${imageSize/4}`

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Style</TableHead>
          <TableHead>Tags</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runes?.map((rune, index) => (
          <TableRow key={rune?.id || `rune-${index}`}>
            <TableCell>
              <div className={`${imageSizeClass} rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
                <Image
                  src={runesService.getRuneImageUrl(rune.icon)}
                  alt={`${rune.name} icon`}
                  width={imageSize}
                  height={imageSize}
                  className="rounded-md object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', rune.icon, e)
                    // Show initials when image fails to load
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-sm">${rune.name.charAt(0)}</span>`
                    }
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                  }}
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{rune.name}</TableCell>
            <TableCell className="text-gray-600 dark:text-gray-300">
              {rune.shortDesc}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {rune.style}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <Badge key={`rune-${rune.id}`} variant="secondary" className="text-xs">
                  {rune.key}
                </Badge>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
