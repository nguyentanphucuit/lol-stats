'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RunesErrorProps {
  message?: string
}

export function RunesError({ message = 'Failed to load runes. Please try again later.' }: RunesErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
