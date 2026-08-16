import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
let server;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
const distIndexPath = path.join(distPath, 'index.html');
const hasClientBuild = existsSync(distIndexPath);

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

if (hasClientBuild) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    return res.sendFile(distIndexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).send('API server is running. Build the client to serve the frontend from this host.');
  });
}

const startServer = async () => {
  try {
    await connectDB();

    server = app
      .listen(port, () => {
        console.log(`Server running on port ${port}`);
      })
      .on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.error(`Port ${port} is already in use. Stop the existing process or change PORT.`);
        } else {
          console.error('Server failed to start:', error.message);
        }

        process.exit(1);
      });
  } catch (error) {
    console.error('Server startup aborted:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
export { server, startServer };
