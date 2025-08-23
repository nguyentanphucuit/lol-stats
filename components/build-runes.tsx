'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RuneSlot {
  name: string
  description?: string
}

interface RunePath {
  name: string
  keystone: string
  slots: RuneSlot[]
}

interface BuildRunesProps {
  primary: RunePath
  secondary: RunePath
  className?: string
}

export function BuildRunes({ primary, secondary, className = '' }: BuildRunesProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Path */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-center">
            <Badge variant="default" className="text-xs">
              {primary.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Keystone */}
            <div className="text-center">
              <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">
                Keystone
              </div>
              <Badge variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                {primary.keystone}
              </Badge>
            </div>
            
            {/* Primary Slots */}
            <div className="space-y-2">
              {primary.slots.map((slot, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slot {index + 1}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {slot.name}
                  </Badge>
                  {slot.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                      {slot.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Path */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-center">
            <Badge variant="outline" className="text-xs">
              {secondary.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {secondary.slots.map((slot, index) => (
              <div key={index} className="text-center">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slot {index + 1}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {slot.name}
                </Badge>
                {slot.description && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                    {slot.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
