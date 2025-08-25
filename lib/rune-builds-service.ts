import { prisma } from './prisma'

export interface RuneBuildData {
  championKey?: string
  championName?: string
  gameMode: string
  primaryTreeId: number
  primaryTreeName: string
  secondaryTreeId: number
  secondaryTreeName: string
  primaryRunes: any[]
  secondaryRunes: any[]
  statShards: any[]
  selectedItems1: any[]
  selectedItems2: any[]
  selectedSpells: any[]
}

export class RuneBuildsService {
  /**
   * Save a new rune build to the database
   */
  static async saveBuild(buildData: RuneBuildData) {
    try {
      const build = await prisma.runeBuild.create({
        data: {
          championKey: buildData.championKey,
          championName: buildData.championName,
          gameMode: buildData.gameMode,
          primaryTreeId: Number(buildData.primaryTreeId),
          primaryTreeName: buildData.primaryTreeName,
          secondaryTreeId: Number(buildData.secondaryTreeId),
          secondaryTreeName: buildData.secondaryTreeName,
          primaryRunes: buildData.primaryRunes.map(rune => ({
            ...rune,
            id: Number(rune.id),
            slotNumber: Number(rune.slotNumber)
          })),
          secondaryRunes: buildData.secondaryRunes.map(rune => ({
            ...rune,
            id: Number(rune.id),
            slotNumber: Number(rune.slotNumber)
          })),
          statShards: buildData.statShards.map(shard => ({
            ...shard,
            id: Number(shard.id),
            slotIndex: Number(shard.slotIndex)
          })),
          selectedItems1: buildData.selectedItems1.map(item => ({
            ...item,
            id: Number(item.id)
          })),
          selectedItems2: buildData.selectedItems2.map(item => ({
            ...item,
            id: Number(item.id)
          })),
          selectedSpells: buildData.selectedSpells.map(spell => ({
            ...spell,
            id: Number(spell.id)
          })),
        },
      })
      
      return build
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Unknown table')) {
          throw new Error('Database table not found. Please run database migration.')
        } else if (error.message.includes('connection')) {
          throw new Error('Database connection failed. Please check your connection.')
        } else {
          throw new Error(`Database error: ${error.message}`)
        }
      }
      
      throw new Error('Failed to save rune build')
    }
  }

  /**
   * Get all rune builds
   */
  static async getAllBuilds() {
    try {
      const builds = await prisma.runeBuild.findMany({
        orderBy: { createdAt: 'desc' },
      })
      return builds
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Unknown table')) {
          throw new Error('Database table not found. Please run database migration.')
        } else if (error.message.includes('connection')) {
          throw new Error('Database connection failed. Please check your connection.')
        } else {
          throw new Error(`Database error: ${error.message}`)
        }
      }
      throw new Error('Failed to fetch rune builds')
    }
  }

  /**
   * Get rune builds by champion
   */
  static async getBuildsByChampion(championKey: string) {
    try {
      return await prisma.runeBuild.findMany({
        where: { championKey },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      throw new Error('Failed to fetch rune builds by champion')
    }
  }

  /**
   * Get rune builds by game mode
   */
  static async getBuildsByMode(gameMode: string) {
    try {
      return await prisma.runeBuild.findMany({
        where: { gameMode },
        select: {
          championKey: true,
          championName: true,
          gameMode: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      throw new Error('Failed to fetch rune builds by mode')
    }
  }

  /**
   * Delete a rune build
   */
  static async deleteBuild(id: string) {
    try {
      return await prisma.runeBuild.delete({
        where: { id },
      })
    } catch (error) {
      throw new Error('Failed to delete rune build')
    }
  }
}
