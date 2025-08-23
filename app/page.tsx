'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            League of Legends Champions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore the vast roster of League of Legends champions with detailed information, 
            search capabilities, and comprehensive filtering options.
          </p>
          <Link href="/champions">
            <Button size="lg" className="text-lg px-8 py-3">
              Browse Champions
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-xl">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Find champions by name or filter by their roles and tags
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-xl">Real-time Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Always up-to-date champion information from Riot Games
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-xl">Modern UI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Beautiful, responsive interface built with modern web technologies
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
              <CardDescription>
                Built with Next.js 15, TypeScript, TailwindCSS, and shadcn/ui
              </CardDescription>
            </CardHeader>
            <CardContent className="text-left">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li>• Next.js 15 with App Router for modern React development</li>
                <li>• TypeScript for type-safe code across the entire application</li>
                <li>• TailwindCSS for utility-first styling</li>
                <li>• shadcn/ui components for consistent design system</li>
                <li>• Prisma ORM with Neon PostgreSQL for data persistence</li>
                <li>• TanStack Query for efficient data fetching and caching</li>
                <li>• Automatic champion data synchronization from Riot Games API</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

