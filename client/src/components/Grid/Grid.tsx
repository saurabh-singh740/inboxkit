import React, { useCallback, useMemo } from 'react';
import Tile from './Tile';
import { useGameStore, tileKey } from '../../store/gameStore';
import { useUserStore } from '../../store/userStore';
import { GRID_SIZE, TILE_PX, GAP_PX } from '../../utils/grid';

interface GridProps {
  onClaim: (x: number, y: number) => void;
}

/**
 * Renders the 50×50 grid.
 *
 * Why inline style grid (not Tailwind): Tailwind's grid-cols uses integer
 * suffix classes. grid-cols-50 isn't in the default config. An inline style
 * avoids a safelist or plugin and compiles to zero CSS.
 *
 * Selector granularity: each Tile reads from the stable tiles[] array at a
 * known index. The array is mutated in-place via updateTile (index arithmetic:
 * y*50+x), so only the changed index produces a new reference — React.memo
 * skips all other tiles.
 */
export default function Grid({ onClaim }: GridProps) {
  const tiles = useGameStore((s) => s.tiles);
  const recentlyClaimed = useGameStore((s) => s.recentlyClaimed);
  const userId = useUserStore((s) => s.user?._id);

  const handleClaim = useCallback(
    (x: number, y: number) => onClaim(x, y),
    [onClaim],
  );

  const gridStyle = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_PX}px)`,
      gap: `${GAP_PX}px`,
    }),
    [],
  );

  if (!tiles.length) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-mono">Loading grid…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={gridStyle} className="select-none">
      {tiles.map((tile) => {
        const key = tileKey(tile.x, tile.y);
        return (
          <Tile
            key={key}
            x={tile.x}
            y={tile.y}
            isClaimed={tile.ownerId !== null}
            ownerColor={tile.ownerColor}
            ownerName={tile.ownerName}
            isFlashing={recentlyClaimed.has(key)}
            isOwnedByMe={tile.ownerId === userId}
            onClaim={handleClaim}
          />
        );
      })}
    </div>
  );
}
