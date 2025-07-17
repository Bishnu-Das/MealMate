import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001'; // Your backend URL

class SocketService {
  constructor() {
    this.socket = null;
    this.connecting = false; // New flag to track connection attempts
  }

  connect(userId, userType) {
    if (this.socket && this.socket.connected) {
      console.log('SocketService: Already connected.');
      return;
    }
    if (this.connecting) {
      console.log('SocketService: Connection already in progress.');
      return;
    }

    this.connecting = true;
    this.socket = io(SOCKET_URL, { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('SocketService: Connected. Socket ID:', this.socket.id);
      this.connecting = false;
      if (userId && userType) {
        this.joinRoom(`${userType}_${userId}`);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('SocketService: Disconnected. Reason:', reason);
      this.connecting = false;
    });

    this.socket.on('connect_error', (err) => {
      console.error('SocketService: Connection error:', err.message);
      this.connecting = false;
    });
  }

  joinRoom(roomName) {
    if (this.socket && this.socket.connected) {
      console.log(`SocketService: Joining room: ${roomName}`);
      this.socket.emit('join_room', roomName);
    } else {
      console.warn(`SocketService: Cannot join room. Socket not connected.`);
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('SocketService: Disconnecting socket.');
      this.socket.disconnect();
      this.socket = null;
      this.connecting = false; // Ensure flag is reset on manual disconnect
    }
  }

  emit(event, data) {
    if (this.socket) {
      console.log(`SocketService: Emitting event '${event}' with data:`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`SocketService: Cannot emit '${event}'. Socket not connected.`);
    }
  }

  on(event, callback) {
    if (this.socket) {
      console.log(`SocketService: Registering listener for event: ${event}`);
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      console.log(`SocketService: De-registering listener for event: ${event}`);
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();