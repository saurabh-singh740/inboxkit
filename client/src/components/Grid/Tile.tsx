import React, { memo } from 'react';
import { TILE_PX } from '../../utils/grid';

interface TileProps {
  x: number;
  y: number;
  isClaimed: boolean;
  ownerColor: string | null;
  ownerName: string | null;
  isFlashing: boolean;
  isOwnedByMe: boolean;
  onClaim: (x: number, y: number) => void;
}

/**
 * Renders a single grid tile.
 *
 * Performance: plain <div> (no Framer Motion) so that all 2500 tiles stay
 * outside the Framer reconciler. Claim animations are pure CSS keyframes
 * (defined in index.css) applied via className, which is far cheaper than
 * animating 2500 motion.div instances.
 *
 * The `isFlashing` flag is removed from Zustand after 700 ms so the CSS
 * animation runs once and then the element returns to its normal state.
 */
const Tile = memo(function Tile({
  x,
  y,
  isClaimed,
  ownerColor,
  ownerName,
  isFlashing,
  isOwnedByMe,
  onClaim,
}: TileProps) {
  const handleClick = () => {
    if (!isClaimed) onClaim(x, y);
  };

  return (
    <div
      onClick={handleClick}
      title={
        isClaimed
          ? `${ownerName ?? '?'} — (${x}, ${y})`
          : `Claim (${x}, ${y})`
      }
      className={[
        'tile',
        isClaimed ? 'tile--claimed' : 'tile--free',
        isFlashing ? 'tile--flash' : '',
        isOwnedByMe ? 'tile--mine' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: TILE_PX,
        height: TILE_PX,
        backgroundColor: isClaimed ? (ownerColor ?? '#6366f1') : '#1e293b',
      }}
    />
  );
});

export default Tile;
