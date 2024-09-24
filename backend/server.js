import express from 'express';
import dotenv from 'dotenv';
const app = express();

import authRoutes from './routes/auth-routes.js';
import connectToMongoDB from './db/connectToMongoDB.js';

dotenv.config();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use('/api/auth', authRoutes);

app.listen(8000, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}...`);
});
