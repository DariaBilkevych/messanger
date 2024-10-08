import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth-routes.js';
import userRoutes from './routes/user-routes.js';
import messageRoutes from './routes/message-routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';

import { app, server } from './socket/socket.js';

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}...`);
});
