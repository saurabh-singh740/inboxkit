import { create } from 'zustand';
import type { TileData, LeaderboardEntry, ConnectionStatus } from '../types';

// ── Helpers ─────────────────────────────────────────────────────────────────

export function tileKey(x: number, y: number): string {
  return `${x},${y}`;
}

const FLASH_DURATION_MS = 700;

// ── Store ────────────────────────────────────────────────────────────────────

interface GameStore {
  // Grid state
  tiles: TileData[];
  tileMap: Map<string, TileData>;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;

  // Live state
  leaderboard: LeaderboardEntry[];
  connectionStatus: ConnectionStatus;
  recentlyClaimed: Set<string>;

  // Actions
  setTiles: (tiles: TileData[]) => void;
  updateTile: (tile: TileData) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  flashTile: (key: string) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  tiles: [],
  tileMap: new Map(),
  isLoaded: false,
  isLoading: false,
  error: null,
  leaderboard: [],
  connectionStatus: 'connecting',
  recentlyClaimed: new Set(),

  setTiles: (tiles) => {
    const tileMap = new Map<string, TileData>();
    for (const t of tiles) tileMap.set(tileKey(t.x, t.y), t);
    set({ tiles, tileMap, isLoaded: true, isLoading: false });
  },

  updateTile: (tile) => {
    const { tiles, tileMap } = get();
    const key = tileKey(tile.x, tile.y);
    const newMap = new Map(tileMap);
    newMap.set(key, tile);
    // Replace in-place — avoids full array re-creation via index lookup
    const idx = tile.y * 50 + tile.x;
    const newTiles = [...tiles];
    newTiles[idx] = tile;
    set({ tiles: newTiles, tileMap: newMap });
  },

  setLeaderboard: (leaderboard) => set({ leaderboard }),

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  flashTile: (key) => {
    const cur = get().recentlyClaimed;
    const next = new Set(cur);
    next.add(key);
    set({ recentlyClaimed: next });

    // Auto-remove after animation completes
    setTimeout(() => {
      const s = get().recentlyClaimed;
      const cleaned = new Set(s);
      cleaned.delete(key);
      set({ recentlyClaimed: cleaned });
    }, FLASH_DURATION_MS);
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
