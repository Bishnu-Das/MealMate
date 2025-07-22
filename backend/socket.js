import { Server } from 'socket.io';
import { handleRestaurantSocketEvents } from './socketHandlers/restaurantSocketHandler.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', // Allow requests from the frontend
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}.`);
    });

    // Register restaurant-specific socket event handlers
    handleRestaurantSocketEvents(socket);

    socket.on('send_message', (data) => {
      io.to(data.orderId).emit('receive_message', data);
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
