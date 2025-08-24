import { useState, useEffect } from 'react';
import { RuneBuildData } from '@/lib/rune-builds-service';

// Extend the RuneBuildData with Prisma-generated fields
export interface RuneBuild extends RuneBuildData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useRuneBuilds() {
  const [runeBuilds, setRuneBuilds] = useState<RuneBuild[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRuneBuilds() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/rune-builds');
        if (!response.ok) {
          throw new Error('Failed to fetch rune builds');
        }
        const builds = await response.json();
        setRuneBuilds(builds);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch rune builds');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRuneBuilds();
  }, []);

  return { runeBuilds, isLoading, error };
}
