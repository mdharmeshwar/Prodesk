import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

const startServer = async () => {
  const databaseReady = await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    if (!databaseReady) {
      console.warn('Application started without MongoDB. Auth routes will still run in memory-free development mode only if the DB is absent.');
    }
  });
};

startServer();

export default app;
