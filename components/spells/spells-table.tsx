'use client'

import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Spell } from '@/types'
import { spellsService } from '@/lib/spells-service'
import { APP_CONFIG } from '@/lib/constants'

interface SpellsTableProps {
  spells: Spell[]
  isLoading: boolean
  spellsPerPage: number
}

export function SpellsTable({ spells, isLoading, spellsPerPage }: SpellsTableProps) {
  const renderLoadingSkeletons = () => {
    const imageSize = APP_CONFIG.CHAMPION_IMAGE_SIZE
    const imageSizeClass = `w-${imageSize/4} h-${imageSize/4}`

    return Array.from({ length: spellsPerPage }).map((_, i) => (
      <TableRow key={`spells-skeleton-${i}`}>
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
          <Skeleton className="h-6 w-20" />
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
      <TableCell colSpan={6} className="text-center py-8">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">No spells found</p>
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
            <TableHead>Cooldown</TableHead>
            <TableHead>Range</TableHead>
            <TableHead>Modes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderLoadingSkeletons()}
        </TableBody>
      </Table>
    )
  }

  if (!spells || spells.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Cooldown</TableHead>
            <TableHead>Range</TableHead>
            <TableHead>Modes</TableHead>
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
          <TableHead>Cooldown</TableHead>
          <TableHead>Range</TableHead>
          <TableHead>Modes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spells?.map((spell, index) => (
          <TableRow key={spell?.id || `spell-${index}`}>
            <TableCell>
              <div className={`${imageSizeClass} rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
                <Image
                  src={spellsService.getSpellImageUrl(spell.image.full)}
                  alt={`${spell.name} icon`}
                  width={imageSize}
                  height={imageSize}
                  className="rounded-md object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', spell.image.full, e)
                    // Show initials when image fails to load
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-sm">${spell.name.charAt(0)}</span>`
                    }
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                  }}
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{spell.name}</TableCell>
            <TableCell className="text-gray-600 dark:text-gray-300">
              {spell.description}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="text-xs">
                {spell.cooldownBurn}s
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="text-xs">
                {spell.rangeBurn}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {spell.modes.slice(0, 3).map((mode) => (
                  <Badge key={mode} variant="secondary" className="text-xs">
                    {mode}
                  </Badge>
                ))}
                {spell.modes.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{spell.modes.length - 3}
                  </Badge>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
