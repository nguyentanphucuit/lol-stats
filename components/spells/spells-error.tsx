'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface SpellsErrorProps {
  message?: string
}

export function SpellsError({
  message = 'Failed to load spells. Please try again later.',
}: SpellsErrorProps) {
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-red-600 dark:text-red-400">{message}</p>
      </CardContent>
    </Card>
  )
}
