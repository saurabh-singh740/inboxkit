import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  (import.meta.env.VITE_SOCKET_URL as string | undefined) ?? 'http://localhost:5000';

/**
 * Singleton socket service.
 *
 * Why singleton: we want exactly one WebSocket connection per browser tab
 * regardless of how many components mount/unmount. The connection is kept
 * alive across re-renders; event listeners are attached/detached via hooks.
 */
class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket) return this.socket;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 8_000,
      timeout: 20_000,
    });

    return this.socket;
  }

  get(): Socket | null {
    return this.socket;
  }

  emit<T>(event: string, payload: T): void {
    this.socket?.emit(event, payload);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
