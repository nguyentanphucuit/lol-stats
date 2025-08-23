'use client'

import Image from 'next/image'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Champion } from '@/types'
import { championService } from '@/lib/champion-service'
import { APP_CONFIG } from '@/lib/constants'

interface ChampionsTableProps {
  champions: Champion[]
  isLoading: boolean
  itemsPerPage: number
}

export function ChampionsTable({ champions, isLoading, itemsPerPage }: ChampionsTableProps) {
  const renderLoadingSkeletons = () => {
    const imageSize = APP_CONFIG.CHAMPION_IMAGE_SIZE
    const imageSizeClass = `w-${imageSize/4} h-${imageSize/4}`
    
    return Array.from({ length: itemsPerPage }).map((_, i) => (
      <TableRow key={i}>
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
      <TableCell colSpan={4} className="text-center py-8">
        <div className="text-gray-500">
          <p className="text-lg font-medium mb-2">No champions found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </TableCell>
    </TableRow>
  )
  
  const renderChampionRow = (champion: Champion) => {
    const imageSize = APP_CONFIG.CHAMPION_IMAGE_SIZE
    const imageSizeClass = `w-${imageSize/4} h-${imageSize/4}`
    
    return (
      <TableRow key={champion.id}>
        <TableCell>
          <div className={`${imageSizeClass} rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
            <Image 
              src={championService.getChampionImageUrl(champion.image)}
              alt={`${champion.name} portrait`}
              width={imageSize}
              height={imageSize}
              className="rounded-md object-cover"
              onError={(e) => {
                console.error('Image failed to load:', champion.image, e)
                // Show initials when image fails to load
                const target = e.currentTarget as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-sm">${champion.name.charAt(0)}</span>`
                }
              }}
                          onLoad={() => {
              // Image loaded successfully
            }}
            />
          </div>
        </TableCell>
        <TableCell className="font-medium">{champion.name}</TableCell>
        <TableCell className="text-gray-600 dark:text-gray-300">
          {champion.title}
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {champion.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </TableCell>
      </TableRow>
    )
  }
  
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderLoadingSkeletons()}
        </TableBody>
      </Table>
    )
  }
  
  if (!champions || champions.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderEmptyState()}
        </TableBody>
      </Table>
    )
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Tags</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {champions.map(renderChampionRow)}
      </TableBody>
    </Table>
  )
}
