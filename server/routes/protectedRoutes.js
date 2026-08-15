import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tasks', authMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authenticated access granted.',
    data: {
      user: {
        id: req.user.userId,
        email: req.user.email,
        name: req.user.name,
      },
      tasks: [
        {
          id: 'task-1',
          title: 'Verify identity and secure session',
          status: 'complete',
        },
      ],
    },
  });
});

export default router;
