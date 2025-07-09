import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001'; // Your backend URL

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userType, userId) {
    this.socket = io(SOCKET_URL, { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('Frontend: Connected to socket server');
      if (userType && userId) {
        this.socket.emit('join_room', `${userType}_${userId}`);
      } else if (userType === 'riders') {
        this.socket.emit('join_room', 'riders');
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Frontend: Disconnected from socket server');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Frontend: Socket connection error:', err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();