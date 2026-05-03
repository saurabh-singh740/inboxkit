import type { TileData } from '../types';

export const GRID_SIZE = 50;
export const TILE_PX = 14;    // Rendered tile size in pixels
export const GAP_PX = 1;       // CSS grid gap

export const GRID_PX = GRID_SIZE * TILE_PX + (GRID_SIZE - 1) * GAP_PX; // 749px

export function tileKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function claimedCount(tiles: TileData[]): number {
  return tiles.filter((t) => t.ownerId !== null).length;
}

export function claimedPercent(tiles: TileData[]): number {
  if (!tiles.length) return 0;
  return Math.round((claimedCount(tiles) / tiles.length) * 100);
}
