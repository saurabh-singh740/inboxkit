import { Server, Socket } from 'socket.io';
import * as gridService from '../services/gridService';
import * as userService from '../services/userService';

interface JoinPayload {
  userId: string;
  username: string;
  color: string;
}

interface ClaimPayload {
  x: number;
  y: number;
  userId: string;
  username: string;
  color: string;
}

async function broadcastLeaderboard(io: Server): Promise<void> {
  const leaderboard = await gridService.getLeaderboard();
  io.emit('leaderboard-updated', { leaderboard });
}

export function setupSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Connected  → ${socket.id}`);

    // ── user-join ──────────────────────────────────────────────────────────
    // Fired by the client immediately after connecting.
    // We send the full grid state only to this socket, then broadcast the
    // updated leaderboard to everyone (including new user).
    socket.on('user-join', async (payload: JoinPayload) => {
      try {
        const { userId, username, color } = payload;

        await userService.updateSocketId(userId, socket.id);

        const tiles = await gridService.getFullGrid();
        socket.emit('grid-state', { tiles });

        socket.broadcast.emit('user-joined', { username, color });

        await broadcastLeaderboard(io);

        console.log(`[Socket] ${username} joined (${socket.id})`);
      } catch (err) {
        console.error('[Socket] user-join error:', err);
        socket.emit('error', { message: 'Failed to join session' });
      }
    });

    // ── claim-tile ─────────────────────────────────────────────────────────
    // Attempt to claim (x, y). On success, broadcast tile-updated to ALL
    // clients and refresh the leaderboard. On failure, notify only the
    // requesting socket.
    socket.on('claim-tile', async (payload: ClaimPayload) => {
      try {
        const { x, y, userId, username, color } = payload;

        const result = await gridService.claimTile(x, y, userId, username, color);

        if (!result.success) {
          socket.emit('claim-rejected', { x, y, reason: result.reason });
          return;
        }

        // Broadcast to every connected client including sender
        io.emit('tile-updated', { tile: result.tile });

        await broadcastLeaderboard(io);

        console.log(`[Socket] (${x},${y}) claimed by ${username}`);
      } catch (err) {
        console.error('[Socket] claim-tile error:', err);
        socket.emit('error', { message: 'Failed to claim tile' });
      }
    });

    // ── disconnect ─────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected → ${socket.id} (${reason})`);
    });
  });
}
