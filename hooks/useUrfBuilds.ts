import { useState, useEffect } from 'react';
import { RuneBuildData } from '@/lib/rune-builds-service';

// Extend the RuneBuildData with Prisma-generated fields
export interface UrfBuild extends RuneBuildData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useUrfBuilds() {
  const [urfBuilds, setUrfBuilds] = useState<UrfBuild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUrfBuilds() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/rune-builds');
        if (!response.ok) {
          throw new Error('Failed to fetch rune builds');
        }
        const allBuilds = await response.json();
        
        // Filter only URF builds
        const urfBuilds = allBuilds.filter((build: UrfBuild) => 
          build.gameMode.toLowerCase() === 'urf'
        );
        
        setUrfBuilds(urfBuilds);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch URF builds');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUrfBuilds();
  }, []);

  return { urfBuilds, isLoading, error };
}
