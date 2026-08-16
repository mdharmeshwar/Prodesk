import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

if (process.env.SERVE_STATIC === 'true' || process.env.NODE_ENV === 'production') {
  const candidates = [
    path.resolve(__dirname, '..', 'dist'),
    path.resolve(__dirname, 'dist'),
    path.resolve(process.cwd(), 'dist'),
    path.resolve(process.cwd(), 'src', 'dist'),
  ];

  const staticDir = candidates.find((p) => fs.existsSync(path.join(p, 'index.html')));

  if (staticDir) {
    app.use(express.static(staticDir));

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) return res.status(404).end();
      return res.sendFile(path.join(staticDir, 'index.html'));
    });
  } else {
    console.info('Static build not found; skipping static file serving. Expected one of:', candidates.join(', '));
  }
}

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

export default app;
