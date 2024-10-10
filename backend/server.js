import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth-routes.js';
import userRoutes from './routes/user-routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://192.168.0.104:8081',
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}...`);
});
