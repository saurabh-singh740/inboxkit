import { useEffect } from 'react';
import { socketService } from '../services/socket';
import { useGameStore, tileKey } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import type {
  GridStatePayload,
  TileUpdatedPayload,
  LeaderboardUpdatedPayload,
  ClaimRejectedPayload,
} from '../types';

/**
 * Manages the Socket.io connection lifecycle and binds all server events
 * to the Zustand game store. Should be called once near the top of the
 * component tree (GamePage) after the user has joined.
 */
export function useSocket(): { claimTile: (x: number, y: number) => void } {
  const { setTiles, updateTile, setLeaderboard, setConnectionStatus, flashTile } =
    useGameStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) return;

    const socket = socketService.connect();

    const onConnect = () => {
      setConnectionStatus('connected');
      // Re-emit user-join on every (re)connect so the server sends a fresh
      // grid-state and re-registers the socket ID
      socket.emit('user-join', {
        userId: user._id,
        username: user.username,
        color: user.color,
      });
    };

    const onDisconnect = () => setConnectionStatus('disconnected');
    const onConnectError = () => setConnectionStatus('error');

    const onGridState = (data: GridStatePayload) => setTiles(data.tiles);

    const onTileUpdated = (data: TileUpdatedPayload) => {
      updateTile(data.tile);
      flashTile(tileKey(data.tile.x, data.tile.y));
    };

    const onLeaderboardUpdated = (data: LeaderboardUpdatedPayload) =>
      setLeaderboard(data.leaderboard);

    const onClaimRejected = (data: ClaimRejectedPayload) =>
      console.warn(`[Socket] Claim rejected (${data.x},${data.y}): ${data.reason}`);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('grid-state', onGridState);
    socket.on('tile-updated', onTileUpdated);
    socket.on('leaderboard-updated', onLeaderboardUpdated);
    socket.on('claim-rejected', onClaimRejected);

    // If already connected when this effect runs, fire join immediately
    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('grid-state', onGridState);
      socket.off('tile-updated', onTileUpdated);
      socket.off('leaderboard-updated', onLeaderboardUpdated);
      socket.off('claim-rejected', onClaimRejected);
    };
  }, [user?._id]); // Re-register only if the user identity changes

  const claimTile = (x: number, y: number) => {
    if (!user) return;
    socketService.emit('claim-tile', {
      x,
      y,
      userId: user._id,
      username: user.username,
      color: user.color,
    });
  };

  return { claimTile };
}
