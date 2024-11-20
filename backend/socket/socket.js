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

const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId && userId !== 'undefined') {
    userSocketMap[userId] = { socketId: socket.id, status: 'online' };
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('setOffline', () => {
    console.log('User offline', userId);
    if (userSocketMap[userId]) {
      userSocketMap[userId].status = 'offline';
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });

  socket.on('setOnline', () => {
    console.log('User online again', userId);
    if (userId !== 'undefined') {
      userSocketMap[userId].status = 'online';
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }
  });

  // used for listening events (both on client and server)
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, io, server };
