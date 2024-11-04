import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://192.168.0.102:8081'],
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
  if (userId != 'undefined') {
    userSocketMap[userId] = socket.id;
  }

  // used for listening events (both on client and server)
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete userSocketMap[userId];
  });
});

export { app, io, server };
