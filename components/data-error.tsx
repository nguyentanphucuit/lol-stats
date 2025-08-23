'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataErrorProps {
  message?: string
  title?: string
}

export function DataError({
  message = 'Failed to load data. Please try again later.',
  title = 'Error'
}: DataErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}