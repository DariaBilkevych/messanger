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
  return userSocketMap[receiverId]?.socketId;
};

export const getSenderSocketId = (senderId) => {
  return userSocketMap[senderId]?.socketId;
};

const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== 'undefined') {
    userSocketMap[userId] = { socketId: socket.id, status: 'online' };
    updateOnlineUsers();
  }

  socket.on('setOnlineStatus', (status) => {
    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].status = status;
      updateOnlineUsers();
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete userSocketMap[userId];
    updateOnlineUsers();
  });
});

const updateOnlineUsers = () => {
  const onlineUsers = Object.keys(userSocketMap).filter(
    (userId) => userSocketMap[userId].status === 'online'
  );
  io.emit('getOnlineUsers', onlineUsers);
};

export { app, io, server };
