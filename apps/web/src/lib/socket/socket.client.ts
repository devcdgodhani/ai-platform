import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env['VITE_SOCKET_URL'] ?? 'http://localhost:3000';

class SocketClient {
  private socket: Socket | null = null;

  connect(token?: string): Socket {
    if (!this.socket) {
      this.socket = io(`${SOCKET_URL}/chat`, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        ...(token ? { auth: { token } } : {}),
      });
    }
    return this.socket;
  }

  emit(event: string, data: unknown): void {
    this.socket?.emit(event, data);
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketClient = new SocketClient();
