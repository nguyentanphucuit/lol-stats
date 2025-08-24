'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/components/providers/locale-provider'
import { getLocaleCode } from '@/lib/locale-utils'
import { getTranslations } from '@/lib/translations'
import { useChampions } from '@/hooks/useChampions'
import { championService } from '@/lib/champion-service'
import { BuildRunes } from '@/components/build-runes'
import Image from 'next/image'

// URF builds configuration for champions
const urfBuildsConfig = {
  Aatrox: {
    runes: {
      primary: {
        name: 'Precision',
        keystone: 'Conqueror',
        slots: [
          {
            name: 'Triumph',
            description: 'Gain 12% missing health on takedown',
          },
          {
            name: 'Legend: Tenacity',
            description: 'Gain 5% tenacity per stack',
          },
          {
            name: 'Last Stand',
            description: 'Deal 5-11% increased damage when below 60% health',
          },
        ],
      },
      secondary: {
        name: 'Domination',
        keystone: '',
        slots: [
          {
            name: 'Sudden Impact',
            description:
              'Gain 7 Lethality and 6 Magic Penetration for 5s after using a dash, blink, or teleport',
          },
          {
            name: 'Ravenous Hunter',
            description: 'Heal for 1% of damage dealt to champions',
          },
        ],
      },
    },
    spells: ['Flash', 'Ignite'],
    items: {
      core: ['Eclipse', 'Black Cleaver', "Death's Dance"],
      situational: ["Serylda's Grudge", 'Guardian Angel', 'Maw of Malmortius'],
    },
  },
  Ahri: {
    runes: {
      primary: {
        name: 'Domination',
        keystone: 'Electrocute',
        slots: [
          {
            name: 'Taste of Blood',
            description: 'Heal when you damage an enemy champion',
          },
          {
            name: 'Eyeball Collection',
            description: 'Gain 1 AD or AP per takedown',
          },
          {
            name: 'Ravenous Hunter',
            description: 'Heal for 1% of damage dealt to champions',
          },
        ],
      },
      secondary: {
        name: 'Sorcery',
        keystone: '',
        slots: [
          { name: 'Manaflow Band', description: 'Gain 100 maximum mana' },
          {
            name: 'Scorch',
            description: 'Your next ability hit sets champions on fire',
          },
        ],
      },
    },
    spells: ['Flash', 'Ignite'],
    items: {
      core: ["Luden's Tempest", "Rabadon's Deathcap", 'Void Staff'],
      situational: ['Morellonomicon', "Zhonya's Hourglass", "Banshee's Veil"],
    },
  },
  Akali: {
    runes: {
      primary: {
        name: 'Domination',
        keystone: 'Electrocute',
        slots: [
          {
            name: 'Sudden Impact',
            description:
              'Gain 7 Lethality and 6 Magic Penetration for 5s after using a dash, blink, or teleport',
          },
          {
            name: 'Eyeball Collection',
            description: 'Gain 1 AD or AP per takedown',
          },
          {
            name: 'Ravenous Hunter',
            description: 'Heal for 1% of damage dealt to champions',
          },
        ],
      },
      secondary: {
        name: 'Precision',
        keystone: '',
        slots: [
          {
            name: 'Triumph',
            description: 'Gain 12% missing health on takedown',
          },
          {
            name: 'Coup de Grace',
            description:
              'Deal 8% increased damage to champions below 40% health',
          },
        ],
      },
    },
    spells: ['Flash', 'Ignite'],
    items: {
      core: ['Hextech Rocketbelt', 'Lich Bane', "Rabadon's Deathcap"],
      situational: ['Void Staff', "Zhonya's Hourglass", "Banshee's Veil"],
    },
  },
  Alistar: {
    runes: {
      primary: {
        name: 'Resolve',
        keystone: 'Aftershock',
        slots: [
          {
            name: 'Demolish',
            description: 'Deal 100 + 15% max health damage to turrets',
          },
          {
            name: 'Bone Plating',
            description: 'Take 3 less damage from the next 3 attacks',
          },
          {
            name: 'Unflinching',
            description: 'Gain 10% tenacity and slow resistance',
          },
        ],
      },
      secondary: {
        name: 'Inspiration',
        keystone: '',
        slots: [
          {
            name: 'Hextech Flashtraption',
            description: 'Gain a free flash every 20 seconds',
          },
          {
            name: 'Cosmic Insight',
            description: 'Gain 5% CDR and 5% item CDR',
          },
        ],
      },
    },
    spells: ['Flash', 'Ignite'],
    items: {
      core: ['Sunfire Aegis', 'Thornmail', 'Force of Nature'],
      situational: ["Randuin's Omen", 'Gargoyle Stoneplate', "Warmog's Armor"],
    },
  },
  Amumu: {
    runes: {
      primary: {
        name: 'Resolve',
        keystone: 'Aftershock',
        slots: [
          {
            name: 'Demolish',
            description: 'Deal 100 + 15% max health damage to turrets',
          },
          {
            name: 'Bone Plating',
            description: 'Take 3 less damage from the next 3 attacks',
          },
          {
            name: 'Unflinching',
            description: 'Gain 10% tenacity and slow resistance',
          },
        ],
      },
      secondary: {
        name: 'Domination',
        keystone: '',
        slots: [
          {
            name: 'Cheap Shot',
            description: 'Deal 10-45 bonus true damage to impaired enemies',
          },
          {
            name: 'Ravenous Hunter',
            description: 'Heal for 1% of damage dealt to champions',
          },
        ],
      },
    },
    spells: ['Flash', 'Smite'],
    items: {
      core: ['Sunfire Aegis', 'Thornmail', 'Abyssal Mask'],
      situational: ["Randuin's Omen", 'Gargoyle Stoneplate', "Warmog's Armor"],
    },
  },
}

export default function UrfPage() {
  const { locale } = useLocale()
  const currentLocaleCode = getLocaleCode(locale)
  const translations = getTranslations(locale)

  // Fetch real champion data
  const { champions, isLoading, error } = useChampions({
    page: 1,
    limit: 5,
    q: '',
    tags: [],
  })

  const renderChampionAvatar = (champion: any) => (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-3">
        <Image
          src={championService.getChampionImageUrl(champion.image)}
          alt={`${champion.name} portrait`}
          width={80}
          height={80}
          className="rounded-full object-cover"
          onError={e => {
            console.error('Image failed to load:', champion.name, e)
            // Show initials when image fails to load
            const target = e.currentTarget as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent) {
              parent.innerHTML = `<div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"><span class="text-white font-bold text-xl">${champion.name.charAt(0)}</span></div>`
            }
          }}
        />
      </div>
      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
        {champion.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {champion.title}
      </p>
    </div>
  )

  const renderRunes = (runes: any) => (
    <BuildRunes
      primary={runes.primary}
      secondary={runes.secondary}
      className="h-full"
    />
  )

  const renderSpells = (spells: string[]) => (
    <div className="text-center space-y-2">
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        Summoner Spells
      </div>
      <div className="space-y-1">
        {spells.map((spell, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {spell}
          </Badge>
        ))}
      </div>
    </div>
  )

  const renderItems = (items: any) => (
    <div className="space-y-2">
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Core Items
        </div>
        <div className="space-y-1">
          {items.core.map((item: string, index: number) => (
            <Badge key={index} variant="default" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Situational
        </div>
        <div className="space-y-1">
          {items.situational.map((item: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              URF Champion Builds
            </CardTitle>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ultimate Rapid Fire - The fastest way to dominate the Rift!
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Column Headers */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Champion
            </h3>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Runes
            </h3>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Spells
            </h3>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Core Items
            </h3>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Situational
            </h3>
          </div>

          {/* Champion Builds */}
          {isLoading ? (
            // Loading state
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-4">
                {Array.from({ length: 5 }).map((_, cardIndex) => (
                  <Card
                    key={cardIndex}
                    className="h-48 flex items-center justify-center"
                  >
                    <CardContent className="p-4">
                      <div className="animate-pulse">
                        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
                        <div className="h-4 bg-gray-300 rounded w-24 mx-auto mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-32 mx-auto"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))
          ) : error ? (
            <div className="col-span-5 text-center py-8">
              <p className="text-red-600">Failed to load champions</p>
            </div>
          ) : (
            champions?.champions
              ?.slice(0, 5)
              .map((champion: any, index: number) => {
                const buildConfig =
                  urfBuildsConfig[champion.name as keyof typeof urfBuildsConfig]

                if (!buildConfig) {
                  return null // Skip champions without URF build config
                }

                return (
                  <div key={champion.id} className="space-y-4">
                    {/* Champion Avatar */}
                    <Card className="h-48 flex items-center justify-center">
                      <CardContent className="p-4">
                        {renderChampionAvatar(champion)}
                      </CardContent>
                    </Card>

                    {/* Runes */}
                    <Card className="h-48">
                      <CardContent className="p-4">
                        {renderRunes(buildConfig.runes)}
                      </CardContent>
                    </Card>

                    {/* Spells */}
                    <Card className="h-48 flex items-center justify-center">
                      <CardContent className="p-4">
                        {renderSpells(buildConfig.spells)}
                      </CardContent>
                    </Card>

                    {/* Core Items */}
                    <Card className="h-48">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Core Items
                          </div>
                          <div className="space-y-1">
                            {buildConfig.items.core.map(
                              (item: string, itemIndex: number) => (
                                <Badge
                                  key={itemIndex}
                                  variant="default"
                                  className="text-xs"
                                >
                                  {item}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Situational Items */}
                    <Card className="h-48">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Situational
                          </div>
                          <div className="space-y-1">
                            {buildConfig.items.situational.map(
                              (item: string, itemIndex: number) => (
                                <Badge
                                  key={itemIndex}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {item}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            More champion builds coming soon! URF mode is all about fast-paced
            action and unique strategies.
          </p>
        </div>
      </div>
    </div>
  )
}
