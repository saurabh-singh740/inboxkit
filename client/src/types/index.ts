// ── Domain types ────────────────────────────────────────────────────────────

export interface TileData {
  _id: string;
  x: number;
  y: number;
  ownerId: string | null;
  ownerName: string | null;
  ownerColor: string | null;
  claimedAt: string | null;
}

export interface UserData {
  _id: string;
  username: string;
  color: string;
  totalClaims: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  _id: string;
  username: string;
  color: string;
  totalClaims: number;
}

// ── UI / App types ───────────────────────────────────────────────────────────

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// ── Socket event payloads ────────────────────────────────────────────────────

export interface GridStatePayload {
  tiles: TileData[];
}

export interface TileUpdatedPayload {
  tile: TileData;
}

export interface LeaderboardUpdatedPayload {
  leaderboard: LeaderboardEntry[];
}

export interface ClaimRejectedPayload {
  x: number;
  y: number;
  reason: string;
}

export interface UserJoinedPayload {
  username: string;
  color: string;
}
