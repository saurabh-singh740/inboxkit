import axios, { AxiosInstance } from 'axios';
import type { TileData, LeaderboardEntry, UserData } from '../types';

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

const http: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Normalize error messages so callers always receive an Error instance
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      (err.response?.data as { error?: string } | undefined)?.error ??
      (err as Error).message ??
      'Unexpected error';
    return Promise.reject(new Error(message));
  },
);

// ── Grid ─────────────────────────────────────────────────────────────────────

export const gridApi = {
  getGrid: (): Promise<TileData[]> =>
    http
      .get<{ data: TileData[] }>('/grid')
      .then((r) => r.data.data),

  claimTile: (
    x: number,
    y: number,
    userId: string,
    username: string,
    color: string,
  ): Promise<TileData> =>
    http
      .post<{ data: TileData }>('/grid/claim', { x, y, userId, username, color })
      .then((r) => r.data.data),

  getLeaderboard: (): Promise<LeaderboardEntry[]> =>
    http
      .get<{ data: LeaderboardEntry[] }>('/grid/leaderboard')
      .then((r) => r.data.data),
};

// ── Users ────────────────────────────────────────────────────────────────────

export const userApi = {
  getOrCreate: (username: string): Promise<UserData> =>
    http
      .post<{ data: UserData }>('/users', { username })
      .then((r) => r.data.data),
};
