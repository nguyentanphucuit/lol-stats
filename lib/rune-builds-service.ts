import { prisma } from './prisma'

export interface RuneBuildData {
  championKey?: string
  championName?: string
  gameMode: string
  primaryTreeId: string
  primaryTreeName: string
  secondaryTreeId: string
  secondaryTreeName: string
  primaryRunes: any[]
  secondaryRunes: any[]
  statShards: any[]
  selectedItems: any[]
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
          primaryTreeId: buildData.primaryTreeId,
          primaryTreeName: buildData.primaryTreeName,
          secondaryTreeId: buildData.secondaryTreeId,
          secondaryTreeName: buildData.secondaryTreeName,
          primaryRunes: buildData.primaryRunes,
          secondaryRunes: buildData.secondaryRunes,
          statShards: buildData.statShards,
          selectedItems: buildData.selectedItems,
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
