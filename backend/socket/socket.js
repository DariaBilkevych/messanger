import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://192.168.0.104:8081'],
    methods: ['GET', 'POST'],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export const getSenderSocketId = (senderId) => {
  return userSocketMap[senderId];
};

let userSocketMap = {};

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== 'undefined') {
    userSocketMap[userId] = { socketId: socket.id, isActive: true };
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // used for listening events (both on client and server)
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });

  socket.on('appStateChange', (appState) => {
    if (userId in userSocketMap) {
      userSocketMap[userId].isActive = appState === 'active';
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, io, server };
