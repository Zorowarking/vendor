import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(vendorId) {
    if (this.socket) return;
    
    // Fallback if the token is null, not strictly required if we rely on connection ID
    const token = useAuthStore.getState().sessionToken;
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      query: { vendorId } // Often useful for backend tracking
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      // Let the backend know this connection belongs to this vendor
      this.socket.emit('join:vendor', { vendorId });
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });
  }

  onNewOrder(callback) {
    if (!this.socket) return;
    this.socket.on('new:order', callback);
  }

  offNewOrder(callback) {
    if (!this.socket) return;
    this.socket.off('new:order', callback);
  }

  onOrderUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('order:update', callback);
  }

  offOrderUpdate(callback) {
    if (!this.socket) return;
    this.socket.off('order:update', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Export a singleton instance
export const socketService = new SocketService();
