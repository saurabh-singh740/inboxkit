import { Types } from 'mongoose';
import { Tile, ITile } from '../models/Tile';
import { User } from '../models/User';

export interface ClaimResult {
  success: boolean;
  tile: ITile | null;
  reason?: string;
}

export interface LeaderboardEntry {
  _id: string;
  username: string;
  color: string;
  totalClaims: number;
}

export async function getFullGrid(): Promise<ITile[]> {
  // Sorted row-major so the client can render in order
  return Tile.find({}).sort({ y: 1, x: 1 }).lean<ITile[]>();
}

/**
 * Atomic claim using findOneAndUpdate with `ownerId: null` guard.
 *
 * Concurrency model:
 *   Two simultaneous requests arrive for (x, y). MongoDB processes them
 *   sequentially at the document level. The first findOneAndUpdate matches
 *   (ownerId === null) and succeeds. The second finds ownerId already set,
 *   so the filter no longer matches — it returns null. No lock needed;
 *   MongoDB's single-writer-per-document guarantee does the work.
 */
export async function claimTile(
  x: number,
  y: number,
  userId: string,
  username: string,
  color: string,
): Promise<ClaimResult> {
  if (x < 0 || x > 49 || y < 0 || y > 49) {
    return { success: false, tile: null, reason: 'Coordinates out of range' };
  }

  const updated = await Tile.findOneAndUpdate(
    { x, y, ownerId: null }, // only matches unclaimed tiles
    {
      $set: {
        ownerId: new Types.ObjectId(userId),
        ownerName: username,
        ownerColor: color,
        claimedAt: new Date(),
      },
    },
    { new: true, runValidators: true },
  );

  if (!updated) {
    // Either the tile doesn't exist or it was already claimed
    const existing = await Tile.findOne({ x, y }).lean<ITile>();
    if (!existing) return { success: false, tile: null, reason: 'Tile not found' };
    return { success: false, tile: existing, reason: 'Tile already claimed' };
  }

  // Atomically increment the owner's claim counter
  await User.findByIdAndUpdate(userId, { $inc: { totalClaims: 1 } });

  return { success: true, tile: updated };
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return User.find({ totalClaims: { $gt: 0 } })
    .select('username color totalClaims')
    .sort({ totalClaims: -1 })
    .limit(20)
    .lean<LeaderboardEntry[]>();
}
