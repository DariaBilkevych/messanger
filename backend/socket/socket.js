import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://192.168.0.104:8081'],
    method: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  // used for listening events (both on client and server)
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

export { app, io, server };
