import { useEffect } from 'react';
import { gridApi } from '../services/api';
import { useGameStore } from '../store/gameStore';

/**
 * Fetches the full grid via REST on first mount.
 * The socket `grid-state` event supersedes this once the user joins;
 * this is only a fallback for initial page load without a socket connection.
 */
export function useGrid(): void {
  const { isLoaded, setTiles, setLoading, setError } = useGameStore();

  useEffect(() => {
    if (isLoaded) return;

    setLoading(true);
    gridApi
      .getGrid()
      .then((tiles) => setTiles(tiles))
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [isLoaded]);
}
