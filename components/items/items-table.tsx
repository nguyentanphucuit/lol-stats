'use client'

import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Item } from '@/types'
import { itemsService } from '@/lib/items-service'
import { APP_CONFIG } from '@/lib/constants'

interface ItemsTableProps {
  items: Item[]
  isLoading: boolean
  itemsPerPage: number
}

export function ItemsTable({
  items,
  isLoading,
  itemsPerPage,
}: ItemsTableProps) {
  const renderLoadingSkeletons = () => {
    const imageSize = APP_CONFIG.CHAMPION_IMAGE_SIZE
    const imageSizeClass = `w-${imageSize / 4} h-${imageSize / 4}`

    return Array.from({ length: itemsPerPage }).map((_, i) => (
      <TableRow key={`items-skeleton-${i}`}>
        <TableCell>
          <div
            className={`${imageSizeClass} rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
          >
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
          <Skeleton className="h-6 w-20" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-12" />
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
          <p className="text-lg font-medium mb-2">No items found</p>
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
            <TableHead className="text-center">Cost</TableHead>
            <TableHead className="text-center">Depth</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderLoadingSkeletons()}</TableBody>
      </Table>
    )
  }

  if (!items || items.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Cost</TableHead>
            <TableHead className="text-center">Depth</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderEmptyState()}</TableBody>
      </Table>
    )
  }

  const imageSize = APP_CONFIG.CHAMPION_IMAGE_SIZE
  const imageSizeClass = `w-${imageSize / 4} h-${imageSize / 4}`

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-center">Cost</TableHead>
          <TableHead className="text-center">Depth</TableHead>
          <TableHead>Tags</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((item, index) => (
          <TableRow key={item?.id || `item-${index}`}>
            <TableCell>
              <div
                className={`${imageSizeClass} rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
              >
                <Image
                  src={itemsService.getItemImageUrl(item.image)}
                  alt={`${item.name} icon`}
                  width={imageSize}
                  height={imageSize}
                  className="rounded-md object-cover"
                  onError={e => {
                    console.error('Image failed to load:', item.image, e)
                    // Show initials when image fails to load
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 font-medium text-sm">${item.name.charAt(0)}</span>`
                    }
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                  }}
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-gray-600 dark:text-gray-300">
              {item.plaintext}
            </TableCell>
            <TableCell className="text-center">
              {item.gold.purchasable ? (
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                  {item.gold.total}đ
                </span>
              ) : (
                <span className="text-gray-500 text-sm">Not purchasable</span>
              )}
            </TableCell>
            <TableCell className="text-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.depth || 1}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tag || `tag-${tagIndex}`}
                    variant="outline"
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
