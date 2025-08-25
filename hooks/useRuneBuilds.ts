import { useState, useEffect, useCallback } from 'react';
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

  const fetchRuneBuilds = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchRuneBuilds();
  }, [fetchRuneBuilds]);

  return { runeBuilds, isLoading, error, refetch: fetchRuneBuilds };
}

export function useRuneBuildsByMode(mode: string | null) {
  const [buildsByMode, setBuildsByMode] = useState<RuneBuild[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBuildsByMode = useCallback(async (gameMode: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/rune-builds?mode=${encodeURIComponent(gameMode)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rune builds by mode');
      }
      const builds = await response.json();
      setBuildsByMode(builds);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rune builds by mode');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode) {
      fetchBuildsByMode(mode);
    } else {
      setBuildsByMode([]);
    }
  }, [mode, fetchBuildsByMode]);

  return { buildsByMode, isLoading, error, refetch: fetchBuildsByMode };
}
