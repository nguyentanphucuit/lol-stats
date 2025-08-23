'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useLocale } from '@/components/providers/locale-provider'
import { getLocaleCode } from '@/lib/locale-utils'
import { getTranslations } from '@/lib/translations'
import { useChampions } from '@/hooks/useChampions'
import { useRuneTrees } from '@/hooks/useRuneTrees'
import { useStatPerks } from '@/hooks/useStatPerks'
import { runesService } from '@/lib/runes-service'
import { statPerksService } from '@/lib/stat-perks-service'
import Image from 'next/image'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface SelectedRune {
  id: number
  name: string
  icon: string
  slot: string
  style: string
}

interface SelectedStatPerk {
  id: number
  name: string
  iconUrl: string
}

export default function RuneBuilderPage() {
  const { locale } = useLocale()
  const currentLocaleCode = getLocaleCode(locale)
  const translations = getTranslations(locale)
  
  // State for selected champion
  const [selectedChampion, setSelectedChampion] = useState<any>(null)
  const [showChampionSelector, setShowChampionSelector] = useState(false)
  
  // State for selected runes
  const [selectedRunes, setSelectedRunes] = useState<SelectedRune[]>([])
  const [selectedStatPerks, setSelectedStatPerks] = useState<SelectedStatPerk[]>([])
  
  // Hooks
  const { champions, isLoading: championsLoading } = useChampions({
    page: 1,
    limit: 100,
    q: ''
  })
  
  const { runeTrees, isLoading: runeTreesLoading } = useRuneTrees()
  const { statPerks, isLoading: statPerksLoading } = useStatPerks({
    page: 1,
    limit: 30,
    q: ''
  })

  // Handle champion selection
  const handleChampionSelect = (champion: any) => {
    setSelectedChampion(champion)
    setShowChampionSelector(false)
  }

  // Handle rune selection
  const handleRuneSelect = (rune: any, slot: string, style: string) => {
    const newRune: SelectedRune = {
      id: rune.id,
      name: rune.name,
      icon: rune.icon,
      slot,
      style
    }
    
    // Replace existing rune in same slot/style
    setSelectedRunes(prev => {
      const filtered = prev.filter(r => !(r.slot === slot && r.style === style))
      return [...filtered, newRune]
    })
  }

  // Handle stat perk selection
  const handleStatPerkSelect = (perk: any) => {
    if (selectedStatPerks.length >= 3) {
      // Replace the last one if we already have 3
      setSelectedStatPerks(prev => [...prev.slice(0, 2), perk])
    } else {
      setSelectedStatPerks(prev => [...prev, perk])
    }
  }

  // Remove stat perk
  const removeStatPerk = (index: number) => {
    setSelectedStatPerks(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-8">
            <Link href={`/${currentLocaleCode}/runes-builds`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rune Trees
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Rune Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create custom rune builds for your champions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Champion Selection */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Champion</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChampion ? (
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 relative rounded-lg overflow-hidden">
                        <Image
                          src={selectedChampion.image}
                          alt={selectedChampion.name}
                          width={96}
                          height={96}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{selectedChampion.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{selectedChampion.title}</p>
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {selectedChampion.tags?.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowChampionSelector(true)}
                        className="w-full"
                      >
                        Change Champion
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-4">No champion selected</p>
                      <Button onClick={() => setShowChampionSelector(true)}>
                        Select Champion
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stat Perks Selection */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Stat Perks</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select up to 3 stat perks
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedStatPerks.map((perk, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <Image
                          src={perk.iconUrl}
                          alt={perk.name}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="text-sm flex-1">{perk.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStatPerk(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {selectedStatPerks.length < 3 && (
                      <div className="text-center py-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowChampionSelector(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Stat Perk
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Rune Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Rune Build</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select runes for each slot
                  </p>
                </CardHeader>
                <CardContent>
                  {runeTreesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading rune trees...</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {runeTrees?.map((tree) => (
                        <div key={tree.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 relative">
                              <Image
                                src={runesService.getRuneImageUrl(tree.icon)}
                                alt={tree.name}
                                width={32}
                                height={32}
                                className="rounded"
                              />
                            </div>
                            <h3 className="font-semibold">{tree.name}</h3>
                            <Badge variant="outline">{tree.key}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tree.slots.map((slot, slotIndex) => (
                              <div key={slotIndex} className="border-l-2 border-gray-200 pl-4">
                                <h4 className="font-medium text-sm mb-2">{slot.name}</h4>
                                <div className="flex flex-wrap gap-2">
                                  {slot.runes.map((rune) => {
                                    const isSelected = selectedRunes.some(
                                      r => r.id === rune.id && r.slot === slot.name && r.style === tree.name
                                    )
                                    return (
                                      <Tooltip key={rune.id}>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant={isSelected ? "default" : "outline"}
                                            size="sm"
                                            className="p-1 h-auto"
                                            onClick={() => handleRuneSelect(rune, slot.name, tree.name)}
                                          >
                                            <Image
                                              src={runesService.getRuneImageUrl(rune.icon)}
                                              alt={rune.name}
                                              width={32}
                                              height={32}
                                              className="rounded"
                                            />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <div className="max-w-xs">
                                            <p className="font-semibold">{rune.name}</p>
                                            <p className="text-sm">{rune.shortDesc}</p>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Champion Selector Modal */}
          {showChampionSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Select Champion</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChampionSelector(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {championsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading champions...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {champions?.champions?.map((champion: any) => (
                      <div
                        key={champion.id}
                        className="text-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => handleChampionSelect(champion)}
                      >
                        <div className="w-16 h-16 mx-auto mb-2 relative rounded-lg overflow-hidden">
                          <Image
                            src={champion.image}
                            alt={champion.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium truncate">{champion.name}</p>
                        <p className="text-xs text-gray-500 truncate">{champion.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
